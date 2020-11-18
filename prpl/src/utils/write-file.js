const fs = require('fs');

const injectHtml = (context, html) => {
  const prplRegex = /<prpl><\/prpl>/;
  const srcContext = context.replace('dist', 'src');

  const srcFile = fs.readdirSync(srcContext)[0];
  if (typeof srcFile != 'string') {
    console.error('[Error] Only one html file is allowed per source subdirectory, exiting.');
    process.exit();
  }

  const srcTemplate = fs.readFileSync(`${srcContext}/${srcFile}`).toString();
  if (!prplRegex.test(srcTemplate)) {
    console.error('[Error] - Source html file does not include <prpl></prpl>, exiting.');
    process.exit();
  }

  return srcTemplate.replace(prplRegex, html);
}

const writeFile = (context, file, html) => {
  if (!fs.existsSync(context)) {
    fs.mkdirSync(context, { recursive: true });
  }
  const outputFile = injectHtml(context, html);
  fs.writeFileSync(`${context}${file}`, outputFile);
}

module.exports = {
  writeFile
}