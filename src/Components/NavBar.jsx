import React from 'react';
import { Navbar, Alignment } from "@blueprintjs/core";
const NavBar = ({ view, setView }) => {

  const handleClick = ({ target: { name } }) => {
    if (name === 'payment') {
      if (!view) {
        setView(prev => (!prev));
      }
    }
    else if (name === 'coffee') {
      if (view) {
        setView(prev => (!prev));
      }
    }
  }

  return (
    <Navbar className="bp3-dark">
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Finite State Machine</Navbar.Heading>
        <Navbar.Divider />
        <button name="payment" className="bp3-button bp3-minimal bp3-icon-circle" onClick={handleClick}>Payment Form</button>
        <button name="coffee" className="bp3-button bp3-minimal bp3-icon-circle" onClick={handleClick}>Make Coffee</button>
      </Navbar.Group>
    </Navbar>
  );
}

export default NavBar;
