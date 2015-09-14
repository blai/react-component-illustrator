
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

export function generateManifest(options, items) {
  if (options.dest) {
    items = items.map(digest);
  }

  let contents = `module.exports = [${items}];`;

  if (options.dest) {
    mkdirp.sync(path.dirname(options.dest));
    fs.writeFileSync(options.dest, contents);
  } else {
    console.log(contents);
  }

  return items;
}

export function digest(item) {
  var str = JSON.stringify(item);
  str = str.replace(/\}$/, `,renderer: require('${item.exampleRequirePath}')}`);
  return str;
}
