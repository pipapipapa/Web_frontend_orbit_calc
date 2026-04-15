import type { FC } from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { MISSION_MOCK } from "../modules/mock";

export const Navigation: FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>OrbitCalc</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTES.HOME}>Каталог</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to={ROUTES.MISSION}>
              🛒 Корзина <Badge bg="primary">{MISSION_MOCK.items.length}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};