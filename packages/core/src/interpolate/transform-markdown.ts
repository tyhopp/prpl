import marked from 'marked';
import { PRPLInterpolateOptions } from '../types/prpl';

// Override code block rendering
const renderer = {
  code(code, infostring) {
    return `<pre class="language-${infostring}"><code class="language-${infostring}">${code}</code></pre>`;
  }
};

marked.use({ renderer });

interface TransformMarkdownArgs {
  markdown: string;
  options?: PRPLInterpolateOptions;
}

/**
 * Transform content markdown to HTML.
 */
async function transformMarkdown(args: TransformMarkdownArgs): Promise<string> {
  const { markdown, options = {} } = args || {};
  const html = marked(markdown, options?.markedOptions);
  return html;
}

export { transformMarkdown };
