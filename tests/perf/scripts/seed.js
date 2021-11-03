const fs = require('fs').promises;
const path = require('path');

async function interpolateContent(i) {
    return `<\!--
title: Title ${i}
slug: notes/${i}
date: 2021-11-03
description: Description ${i}.
categories: Misc
--\>

If you're a frontend developer in 2020, the [serverless](https://serverless.css-tricks.com) movement has given you agency that you've never had before: writing server-side code without all the nuance and pain of infrastructure configuration. [Netlify](https://www.netlify.com), a platform for hosting and continuously deploying your site without touching tools like [Jenkins](https://jenkins.io) or [Bamboo](https://www.atlassian.com/software/bamboo), takes the serverless idea and pushes the bill even further with [Netlify Functions](https://www.netlify.com/products/functions/). Now, creating a call-able REST API that runs an [AWS Lambda function](https://aws.amazon.com/lambda/features/) is as simple as creating a directory in our repo, flipping a switch in Netlify and writing the code.

To achieve the dream of using Bear as an authoring tool for the web, I decided to leverage the power of Netlify functions to write a service callable via Scriptable in iOS. The complete flow shapes up like this:

* Write a note in Bear
* Click 'Share' from the note
* Click 'Run Script' in Scriptable to run some JavaScript
* The script makes a PUT request to our Netlify function, sending the note's content
* Our function parses the note content and makes requests to [Contentful](https://contentful.com), sending the note there, creating and publishing content blocks
* Contentful triggers Netlify to re-deploy the website when the new note is published
* Netlify deploys the site and the note is viewable from the website

### Define the scope of our function
Before hacking away, it's helpful to define exactly what the function should achieve:

* Define a REST endpoint with a PUT method
* Expose the resource on this domain, https://tyhopp.com
* Require a special header, in our case \`bear-to-contentful\`, with a secret access key so we have permission to create objects in Contentful
* Parse the raw markdown note payload and format into a structured object that we can send to the [Contentful Content Management API](https://www.contentful.com/developers/docs/references/content-management-api/)
* Call the Contentful API to create the note in Contentful
* Call the Contentful API to publish the note in Contentful
* Return a success or error response to the caller, in our case Scriptable

With this spec, let's dive deeper into the code required to pull it off.

### But first, some setup
The whole point of using Netlify over the cloud platforms like [AWS](https://aws.amazon.com), [Azure](https://azure.microsoft.com/en-us/) and [GCP](https://cloud.google.com) directly is to avoid all the required steps before you can actually write your code: setting up a billing account, provisioning permissions, configuring API gateways, etc. The luxury of Netlify Functions is we don't even need an account, and the same generous free tier you get on all the platforms (~125k requests and 100 hours of run time) applies here too. Still, you do have to do a couple steps of setup:

- In your Netlify web interface, go to Settings > Functions and [enter the path to your functions directory](https://docs.netlify.com/functions/configure-and-deploy/#configure-the-functions-folder) in your site, in my case \`./functions\`.
- Install [netlify-dev](https://github.com/netlify/cli/blob/master/docs/netlify-dev.md#netlify-functions), the tool they created to enable us to test our functions locally before deploying. In any sane workflow, this is a necessary step. Follow the docs to get up and running.

### Write the code
*To see the finished function currently in production, check it out on [GitHub](https://github.com/tyhopp/tysite/tree/master/functions/bear-to-contentful) - I open sourced this site recently!* 🍻

Now that we have our path declared and our workflow setup, we can commence with the actual programming. A very useful set of examples can be found [on this playground site](https://functions-playground.netlify.com), progressing from hello world to writing a Slack integration. Copy and paste some code to get a feel for it.

For our case, the root function looks like this:

\`\`\`javascript
const { createBlogPost } = require('./src/actions/create');
const { BEAR_TO_CONTENTFUL } = process.env;

/**
 * A lambda function to create/update and publish blog posts in Contentful.
 */
exports.handler = async event => {

  // Ensure credentials are passed
  if (!event.headers['bear-to-contentful'] || (event.headers['bear-to-contentful'] !== BEAR_TO_CONTENTFUL)) {
    return {
      statusCode: 401,
      body: "Invalid Credentials"
    };
  }

  // Parse method and take appropriate action
  switch(event.httpMethod) {
    case 'POST':
    case 'PUT':
      return createBlogPost(JSON.parse(event.body));
    default:
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
  }
};
\`\`\`

We export a single nameless, asynchronous function and pass in the \`event\` parameter, which contains all the properties we need to parse the request: \`headers\`, \`body\` and \`httpMethod\`. In this function, we only need two checks:

* Make sure the \`bear-to-contentful\` header exists and the value matches our [environment variable defined in Netlify](https://docs.netlify.com/configure-builds/environment-variables/) (which we got from Contentful, to be covered in greater detail in the next note).
* Make sure the \`httpMethod\` is \`POST\` or \`PUT\`, since we only want to focus on creating and updating blog posts for now. From Scriptable we will call PUT, because \`PUT\` works in both create and update cases while \`POST\` works only for creation.

If both conditions are met, we send the body into our \`createBlogPost\` function and try to parse, create and publish to Contentful. The key is that if at any point in the function we want to throw an error or return a successful response, we do that by returning an object with a \`statusCode\` and \`body\`.

### Define an interface
Before diving into the \`createBlogPost\` function, we have to consider how our script will parse the things that our Contentful blog post content model requires (more on [content modeling](https://www.contentful.com/r/knowledgebase/content-modelling-basics/) in the next post). Even if you're not using Contentful for your cases, your CMS will still need to differentiate between things like your \`title\`, \`description\` and \`body\`, making this step generally relevant. In my case, I need to parse out these pieces:

* title
* slug
* date
* short description
* category
* body

With that in mind, I created a standard template that all blog posts I write in Bear will use. In doing this, we can create a predictable request body that is more easily parsable in our \`createBlogPost\` function. Here's what it looks like in markdown:

\`\`\`markdown
# Title
slug: my-slug
date: YYYY-MM-DD
description: A description
categories: First, Second
—-—
The body of my note
\`\`\`

### Parse the note
In our cloud function, the [parse and format utility functions](https://github.com/tyhopp/tysite/blob/master/functions/bear-to-contentful/src/utils/format.js) do the regex parsing to break down the markdown above into an object:

\`\`\`javascript
/**
 * Parses the input markdown and returns as an object.
 * @param {string} text the raw markdown to process
 */
const parse = text => {
    // Trim everything before first #
    const trimmedText = text.substring(/(.*?)#/s.exec(text)[1].length);

    // Parse categories
    const parsedCategories = /categories: (.*?)\\n/.exec(trimmedText)[1];
    const categories = /,/.test(parsedCategories)
      ? parsedCategories.split(', ')
      : [parsedCategories];
    
    // Parse all other values
    return {
      title: /# (.*?)\\n/.exec(trimmedText)[1],
      slug: /slug: (.*?)\\n/.exec(trimmedText)[1],
      date: /date: (.*?)\\n/.exec(trimmedText)[1],
      description: /description: (.*?)\\n/.exec(trimmedText)[1],
      categories,
      body: trimmedText.substring(/#(.*)—/s.exec(trimmedText)[1].length + 4)
    };
}

/**
 * Formats a flat object into desired Contentful payload.
 * @param {string} text the raw markdown to process
 */
const format = text => {
  const { title, slug, date, description, categories, body } = parse(text);
  console.log(\`\\n
  Note details:
  —
  title: \${title}
  slug: \${slug}
  date: \${date}
  description: \${description}
  categories: \${categories}
  body: \${body.substring(1, 60)}…
  —
  \`);
  return {
    'fields': {
      'title': { 'en-US': title },
      'slug': { 'en-US': slug },
      'date': { 'en-US': date },
      'shortDescription': { 'en-US': description },
      'category': { 'en-US': categories },
      'body': { 'en-US': body }
    }
  }
};

module.exports = {
  format
}
\`\`\`

There are dozens of ways we could write the regex, and I'm sure what's written above isn't the most efficient, but it works for our purposes. Once the parsing is done, we can move on to the tricky business of [forming the fetch requests to the Contentful Content Management APIs](https://github.com/tyhopp/tysite/blob/master/functions/bear-to-contentful/src/actions/create.js).`
}

const pageCount = new Array(300)

async function generatePages() {
    for (let i = 0; i < pageCount.length; i++) {
        const content = await interpolateContent(i);
        const targetPath = path.resolve(__dirname, '../content/notes', `${i}.md`);
        await fs.writeFile(targetPath, content);
    }
}

generatePages();