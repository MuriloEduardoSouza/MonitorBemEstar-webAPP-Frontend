// src/components/common/HeaderComponent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

function HeaderComponent({ onLogout }) {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          Monitor de Bem-Estar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/daily-record">Novo Registro</Nav.Link> 
            <NavDropdown title="Relatórios" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/reports/daily-evolution">Evolução Diária</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/humor">Distribuição de Humor</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/phone-usage">Horas Celular</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/activities">Distribuição de Atividades</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/weekly-evolution">Evolução Semanal</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/reports/phone-usage">Horas Celular</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/mood">Humor</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reports/activities">Atividades</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/historico">Histórico</Nav.Link> 
            <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={onLogout}>
              Sair
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderComponent;