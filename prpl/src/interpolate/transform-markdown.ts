import { readFileSync } from 'fs';
import marked from 'marked';

// Override code block rendering
const renderer = {
  code(code, infostring) {
    return `<pre class="language-${infostring}"><code class="language-${infostring}">${code}</code></pre>`;
  }
};

marked.use({ renderer });

async function transformMarkdown(filePath: string): Promise<string> {
  const markdown = readFileSync(filePath).toString();
  const html = marked(markdown);
  return html;
}

export { transformMarkdown };
