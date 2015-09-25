import React, { PropTypes, Component } from 'react';
import BaseCase from '../BaseCase';

/**
 * BaseCaseExample
 * description
 *
 * @name BaseCaseExample
 * @component ../../BaseCase
 */
export default class BaseCaseExample extends Component {
  render() {
    let foo = <div>whatever</div>;

    return (
      <BaseCase></BaseCase>
    );
  }
}
