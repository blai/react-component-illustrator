import React, { PropTypes, Component } from 'react';

/**
 * Some description from BaseCase
 *
 * @name {String} a name tag
 */
export default class BaseCase extends Component {
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
      <div>BaseCase</div>
    );
  }
}
