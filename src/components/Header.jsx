import { NavLink } from "react-router-dom";
import { Nav, Container, Navbar } from "react-bootstrap";
import { useContext } from "react";
import CommonContext from "../context/CommonContext";

function Header() {

    const { isLoggedIn } = useContext(CommonContext);

    return <header className="headerMain">
        <Navbar className="headerNavbar" collapseOnSelect expand="lg" variant="light">
            <Container>
                <div className="headerNavbarLogo" >
                    <NavLink to="/">
                        <span className="logo">Blogit</span>
                    </NavLink>
                </div>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        <NavLink exact activeStyle={{ color: "#34656d" }} className="navLinks"
                            to="/blogs">Home</NavLink>
                        {
                            isLoggedIn ? <>
                                <NavLink activeStyle={{ color: "#34656d" }} className="navLinks"
                                    to="/blogs/create">Create-Blog</NavLink>
                                <NavLink activeStyle={{ color: "#34656d" }} className="navLinks"
                                    to="/profile">
                                    <img src="https://res.cloudinary.com/hiddencloud1111/image/upload/v1634630235/defaultProfilePic_xlwkzb.png" alt="profilepic" className="proPic" /> Profile
                                </NavLink>
                            </> :
                                <NavLink activeStyle={{ color: "#34656d" }} className="navLinks"
                                    to="/login">log-in</NavLink>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>

}

export default Header;