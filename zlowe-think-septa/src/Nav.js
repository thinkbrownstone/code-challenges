import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export default class Navi extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md" className="p-5 bg-primary">
          <NavbarBrand href="/">Zachariah Lowe's Think test</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
              <NavLink href="https://www.linkedin.com/in/zachariahlowe">Zach's LinkedIn</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/lzake">Zach's Github</NavLink>
              </NavItem>
              <NavItem>
              <NavLink href="https://www.zachariahlowe.com">Zach's Portfolio</NavLink>
            </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}