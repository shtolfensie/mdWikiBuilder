const showdown = require('showdown')

// exports function for converting md files to html
// expects markdown in <String>
module.exports.convertMdFile = function (markdown) {

  const converter = new showdown.Converter()

  const html = converter.makeHtml(markdown);
  // console.log(html);
  return html;

}

this.convertMdFile(); // when this file is run by node, call this function, otherwise this code doesn't run when converter is called from another file