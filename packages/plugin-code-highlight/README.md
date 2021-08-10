# @prpl/plugin-code-highlight

A plugin for [PRPL](https://github.com/tyhopp/prpl) that highlights code blocks with [Highlight.js](https://github.com/highlightjs/highlight.js).

This plugin **does not include any CSS**. It processes code blocks given the specified syntax (e.g., JavaScript, 
Python) and outputs DOM structures in place that are possible to style with CSS.

`<code>` elements are expected to have a `language-*` class with [languages supported by Highlight.js](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md).

If you're writing in HTML you can write your blocks like this: 
```javascript
    <pre>
      <code class="language-javascript">console.log('Hello world!');</code>
    </pre>
```

If you're writing in markdown you can write your blocks like this:

```markdown
    ```javascript
    <code class="language-javascript">console.log('Hello world!');</code>
    ```
```

See [the default CSS stylesheet](https://github.com/highlightjs/highlight.js/blob/main/src/styles/default.css) for 
an example of how to style Highlight.js processed DOM structures.