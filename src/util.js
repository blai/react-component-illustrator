
import path from 'path';

export function generateManifest(items) {
  items = items.map(digest);
  return `module.exports = [${items}];`;
}

export function digest(item) {
  var str = JSON.stringify(item);
  str = str.replace(/\}$/, `,renderer: require('${item.examplePath}')}`);
  return str;
}

export function relativePath(from, to) {
  var destDir = path.dirname(from);
  var relative = path.relative(destDir, to);

  if (relative[0] !== '.') {
    relative = `.${path.sep}${relative}`;
  }

  return relative;
}
