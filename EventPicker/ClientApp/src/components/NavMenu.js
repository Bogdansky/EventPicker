import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">
              <img id="brand" src="/main_icon.png" alt="no-content"/>
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow btn-group">
                {
                  localStorage.getItem("userId") ? 
                  <React.Fragment>
                    <NavItem>
                      <NavLink tag={Link} className="text-light" to="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="text-light" to="/events">Events</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="text-light" to="/map">Maps</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="text-light" onClick={this.props.onLogout} to="/">Logout</NavLink>
                    </NavItem>
                  </React.Fragment>
                   : 
                  <React.Fragment>
                    <NavItem>
                        <NavLink tag={Link} className="text-light" to="/signup">Sign up</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} className="text-light" to="/signin">Log in</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
                
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
