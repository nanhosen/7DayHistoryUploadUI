import {Container, Navbar, Nav, Button} from 'react-bootstrap';
import InfoModal from './InfoModal'
import React from "react";
import  { Suspense, lazy, useEffect, useState, useContext, useRef } from 'react'; 

const NavbarTop = (props)=>{
	const setter = props.setter
	return(
		<>
			<Navbar bg="dark" variant="dark">
		    <Container>
		      <Navbar.Brand href="#home">
		        <img
		          alt=""
		          src="https://gacc.nifc.gov/gbcc/predictive/7daycompare/upload-form/psplogo.png"
		          width="30"
		          height="30"
		          className="d-inline-block align-top"
		        />{' '}
		      	
		      </Navbar.Brand>
		      <Nav>
			      <Nav.Link style={{color:'#ffffff8c'}}  eventKey={2} href="#memes" onClick={() => setter(true)}>
				        Page Info
			      </Nav.Link>
			      <Nav.Link target="_blank" href="https://gacc.nifc.gov/gbcc/predictive/7daycompare/">Comparison Map</Nav.Link>
			    </Nav>
		    </Container>
		  </Navbar>
		</>
	)
}

export default NavbarTop