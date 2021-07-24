import marked from 'marked';
import { PRPLInterpolateOptions } from '../types/prpl';

// Override code block rendering
const renderer = {
  code(code: string, lang: string) {
    return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`;
  }
};

marked.use({ renderer });

/**
 * Transform content markdown to HTML.
 */
async function transformMarkdown(args: {
  markdown: string;
  options?: PRPLInterpolateOptions;
}): Promise<string> {
  const { markdown, options = {} } = args || {};
  return marked(markdown, options?.markedOptions);
}

export { transformMarkdown };
