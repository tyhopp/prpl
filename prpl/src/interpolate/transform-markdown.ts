import { PRPLFileSystemTree } from '../types/prpl.js';
import marked from 'marked';

// Override code block rendering
const renderer = {
  code(code, infostring) {
    return `<pre class="language-${infostring}"><code class="language-${infostring}">${code}</code></pre>`;
  }
};

marked.use({ renderer });

/**
 * Transform content markdown to HTML.
 */
async function transformMarkdown(srcTree: PRPLFileSystemTree): Promise<string> {
  const html = marked(srcTree?.src);
  return html;
}

export { transformMarkdown };
