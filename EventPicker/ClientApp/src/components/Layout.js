import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu onLogout={this.props.onLogout} />
        <Container id='main'>
                {this.props.children}
        </Container>
      </div>
    );
  }
}
