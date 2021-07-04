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
async function transformMarkdown(markdown: string): Promise<string> {
  const html = marked(markdown);
  return html;
}

export { transformMarkdown };
