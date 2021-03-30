import React from 'react'
import {Navbar,Form,Nav,Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import './NavBar.css'

const NavBar = ({login,logOut,isAuth}) => {
    return (

        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">WAM'S </Navbar.Brand>

            <Nav className="mr-auto">
            <NavLink exact to="/" activeClassName='active-link' className='p-2'>Home</NavLink>
            <NavLink exact to="/profil" activeClassName='active-link' className='p-2 '>profil</NavLink>
            <NavLink to="/admin" activeClassName='active-link' className='p-2 '>Admin</NavLink>
            </Nav>


            <Form inline>
                <Button variant="outline-info" onClick={isAuth ? logOut :login}>
                {isAuth ? "logOut" : "login"}</Button>
            </Form>
            </Navbar>
    )
}

export default NavBar





