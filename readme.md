# react-component-illustrator

`react-component-illustrator` takes in a list of examples for your library of [React.js](https://facebook.github.io/react/) components, group them by the component they are showcasing (you may have more than one example for a component), and return an array of illustrations of your components, along with their examples.

## Install

`npm install --save-dev react-component-illustrator`

## A Quick Sample Illustration

### Inputs

The input of your resulting illustration comes from your [React.js](https://facebook.github.io/react/) components and the examples.

For the most part, you just develop/document them like you normally would (using comment blocks in your .js files), with a few opinionated behaviors I throw in. Here's an example:

Consider you have a project structure like so:

```
AwesomeComponents
├── src
│   └── components
│       ├── Button
│       │   ├── Button.js
│       │   └── examples
│       │       ├── SimpleButton.js
│       │       ├── AnotherButton.js
│       │       └── IconButton.js
│       └── ...
└── ...
```

And your file contents:

```
// src/components/Button/Button.js
import React, { PropTypes, Component } from 'react';

/**
 * Some description for Button
 *
 * some more description for Button
 */
export default class Button extends Component {
  static propTypes = {
    /**
     * Property string's description
     */
    string:     PropTypes.string,
    required:   PropTypes.any.isRequired,
    instanceOf: PropTypes.instanceOf(MyPropType),
    customProp: function (props, propName, componentName) {
      if (!/My/.test(props[propName])) {
        return new Error('Invalid customProp');
      }
    }
  };

  render() {
    return (
      <divButton</div>
    );
  }
}
```

##### Note:
* You can add docs for each `propTypes` by adding `/* */` comment blocks

```
// src/components/Button/examples/SimpleButton.js
import React, { Component } from 'react';
import Button from '../Buton';

/**
 * SimpleButton
 * description
 *
 * @name SimpleButtonExample
 * @component ../../Button
 */
export default class SimpleButtonExample extends Component {
  render() {
    let foo = <div>simple</div>;

    return (
      <div>
        {foo}
        <Button></Button>
      </div>
    );
  }
}
```

##### Note:
* You can use `@name` in jsDoc tag style to customize the name of your example in the output, without it, the name of your example's class would be returned.
* You NEED to use a `@component` tag in your documentation of the example to associate your example with a particular component that you are showcasing. Without this, your example would be categorized under "Random Examples".

```
// src/components/Button/examples/AnotherButton.js
import React, { Component } from 'react';
import Button from '../Buton';

export default class AnotherButtonExample extends Component {
  render() {
    return (
      <Button></Buton>
    );
  }
}
```

```
// src/components/Button/examples/IconButton.js
import React, { Component } from 'react';
import Button from '../Buton';

/**
 * IconButtonExample
 *
 * @component ../../Button
 */
export default class IconButtonExample extends Component {
  render() {
    let foo = <div>Icon</div>;

    return (
      <div>
        {foo}
        <Button></Button>
      </div>
    );
  }
}
```

### output

Running `react-component-illustrator -p src/**/examples/*.js -f commonjs -v` logges the following (modified/beautified for ease of reading)

```
module.exports = [
  {
    "name": "Button",
    "path": "path/to/.../src/components/Button/Button.js",
    "source": "... source code of src/components/Button/Button.js (as string)",
    "description": "Some description for Button\n\nsome more description for Button",
    "props": {
      "string": {
        "type": {
          "name": "string"
        },
        "required": false,
        "description": "Property string's description"
      },
      "required": {
        "type": {
          "name": "any"
        },
        "required": true,
        "description": ""
      },
      "instanceOf": {
        "type": {
          "name": "instanceOf",
          "value": "MyPropType"
        },
        "required": false,
        "description": ""
      },
      "customProp": {
        "type": {
          "name": "custom",
          "raw": "function (props, propName, componentName) {\n  if (!/My/.test(props[propName])) {\n    return new Error('Invalid customProp');\n  }\n}"
        },
        "required": false,
        "description": ""
      }
    },
    "examples": [
      {
        "name": "SimpleButton",
        "path": "path/to/.../src/components/Button/examples/SimpleButton.js",
        "renderer": require("./src/components/Button/examples/SimpleButton.js"),
        "requirePath": "./src/components/Button/examples/SimpleButton.js",
        "description": "<p>SimpleButtonExample<br>description</p>",
        "source": "... source code of src/components/Button/examples/SimpleButton.js (as string)",
        "renderSource": "render() {\n    let foo = <divsimple</div>;\n    return <div>\n      {foo}\n      <Button></Button>\n    </div>;\n}"
      },
      {
        "name": "IconButtonExample",
        "path": "path/to/.../src/components/Button/examples/IconButton.js",
        "renderer": require("./src/components/Button/examples/IconButton.js"),
        "requirePath": "./src/components/Button/examples/IconButton.js",
        "description": "<p>IconButtonExample</p>",
        "source": "... source code of src/components/Button/examples/IconButton.js (as string)",
        "renderSource": "render() {\n    let foo = <div>Icon</div>;\n    return <div>\n      {foo}\n      <Button></Button>\n    </div>;\n}"

      }
    ]
  },
  {
    "name": "Random Examples",
    "examples": [
      {
        "name": "AnotherButtonExample",
        "path": "path/to/.../src/components/Button/examples/AnotherButton.js",
        "renderer": require("./src/components/Button/examples/AnotherButton.js"),
        "requirePath": "./src/components/Button/examples/AnotherButton.js",
        "description": "",
        "source": "... source code of src/components/Button/examples/AnotherButton.js (as string)",
        "renderSource": "render() {\n    return <Button></Button>;\n}"
      }
    ]
  }
]
```


## Usage

### CLI

```
> react-component-illustrator --pattern path/to/components/**/examples/*.js --outputFormat commonjs --dest ./dist
```

#### Options

##### --pattern, -p (one or more)
Path(s) to the examples, could be either glob or absolute path

##### --verbose, -v (optional)
Also prints the result in console.

##### --dest, -d (optional)
The path to the file where output should be saved.

##### --outputFormat, -f (optional, default: 'commonjs')
The type of output, one of:

- commonjs

  ```
module.exports = [
  {
    name: 'MyComponent',
    description: '',
    props: [...],
    examples: [
      {
        name: 'MyComponentExample',
        renderer: require('path/to/MyComponentExample.js'),
        ...
      }
    ]
  },
  ...
];
```

- es6

  ```
export default [
  {
    name: 'MyComponent',
    description: '',
    props: [...],
    examples: [
      {
        name: 'MyComponentExample',
        renderer: require('path/to/MyComponentExample.js'),
        ...
      }
    ]
  },
  ...
];
```

- string

  ```
[
  {
    name: 'MyComponent',
    description: '',
    props: [...],
    examples: [
      {
        name: 'MyComponentExample',
        ...
      }
    ]
  },
  ...
];
```


### API

```
import {illustrate} from 'react-component-illustrator';

illustrate('path/to/components/**/examples/*.js')
  .then(function (illustrations) {
    console.log(illustrations);
  })
  .catch(console.error.bind(console))
;
```


## License

MIT
