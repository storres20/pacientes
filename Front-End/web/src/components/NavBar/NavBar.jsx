import React from 'react'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

import './NavBar.scss'
import logo from './logorb.svg'

function NavBar({logout}) {
  return (
    <div>
      <Navbar bg="light" expand="md">
        <Container fluid>
          <Navbar.Brand>
          <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Link to="/home" className='link'>Home</Link>
              <Link to="/about" className='link'>About</Link>
              
            </Nav>
            
            <Button variant="outline-danger" onClick={logout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar