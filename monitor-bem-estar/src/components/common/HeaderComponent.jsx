// src/components/common/HeaderComponent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

/* Fontes */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* Icones */
import { faUser, faHeartbeat } from '@fortawesome/free-solid-svg-icons';


function HeaderComponent({ onLogout }) {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className='d-flex align-items-center'>
        <FontAwesomeIcon icon={faHeartbeat} className='me-2' size='lg' />
          Monitor de Bem-Estar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto"></Nav> 
          
          <Nav className="mx-auto"> 
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <NavDropdown title="Relatórios" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/reports/daily-evolution">Evolução Diária</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/humor">Distribuição de Humor</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/phone-usage">Horas Celular</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/activities">Distribuição de Atividades</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/historico">Histórico de Registros</Nav.Link>
          </Nav>

          <Nav className="ms-auto">   
            <Nav.Link as={Link} to="/profile" className="d-flex align-items-center me-2"> 
              <FontAwesomeIcon icon={faUser} size="lg" /> 
            </Nav.Link>
            <Button variant="outline-light" onClick={onLogout} id='btnSair'>
              Sair
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderComponent;