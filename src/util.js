import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

export function generateManifest(options, items) {
  if (options.outputFormat === 'commonjs') {
    items = `module.exports = [${items.map(digest)}]`;
  } else if (options.outputFormat === 'es6') {
    items = `export default [${items.map(digest)}]`;
  } else if (options.outputFormat === 'string') {
    items = JSON.stringify(items);
  }

  return items;
}

export function writeToOutput(options, content) {
  if (options.dest) {
    mkdirp.sync(path.dirname(options.dest));
    fs.writeFileSync(options.dest, content);
  }
    console.log(content);

  return content;
}

export function digest(item) {
  var str = JSON.stringify(item);
  str = str.replace(/"requirePath"\s*:\s*("[^"]*")(\s*,?)/, '"renderer":require($1),$&');
  return str;
}

export function aggregate(items) {
  let components = {random: {name: 'Random Examples'}};

  for (let item of items) {
    let component = item.component ? components[item.component.path] : components.random;
    if (!component) {
      component = components[item.component.path] = item.component;
    }

    component.examples = [...(component.examples || []), item.example];
  }

  if (!components.random.examples) {
    delete components.random;
  }

  return Object.values(components);
}

export function toRelativeJsPath(base, file) {
  let jsPath = path.resolve(base, file);
  if (!/\.js$/.test(jsPath)) {
    jsPath += '.js';
  }
  return jsPath;
}
