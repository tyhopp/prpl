const fs = require('fs');
const path = require('path');
const createTree = require('directory-tree');
const transformMarkdown = require('marked');
const { writeFile } = require(path.resolve(__dirname, 'utils/write-file'));

const src = path.resolve('src');
const srcTree = createTree(src, { normalizePath: true });
srcTree.children.forEach(item => {
  if (item.type !== 'directory') {
    const file = fs.readFileSync(item.path).toString();
    fs.writeFileSync(path.resolve('dist', item.name), file);
  }
});

const content = path.resolve('content');
const contentTree = createTree(content, { normalizePath: true });

const render = items => items.forEach(item => {
  switch(item.type) {
    case 'file':
      if (item.extension !== '.md') {
        return;
      }
      const markdown = fs.readFileSync(item.path).toString();
      const html = transformMarkdown(markdown);
      const context = item.path.replace(item.name, '').replace('content', 'dist');
      const file = item.name.replace('.md', '.html');
      writeFile(context, file, html);
      break;
    case 'directory':
      render(item.children);
      break;
  }
});

render(contentTree.children);