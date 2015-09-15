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
  str = str.replace(/"exampleRequirePath"\s*:\s*("[^"]*")(\s*,?)/, '"renderer":require($1),$&');
  return str;
}

export function aggregate(items) {
  let components = {random: {name: 'Random Examples'}};

  for (let item of items) {
    let component = item.component ? components[item.component.path] : components.random;
    if (!component) {
      component = components[item.component.path] = item.component;
    }

    component.examples ? component.examples.push(item.exmaple) : component.examples = [item.example];
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
