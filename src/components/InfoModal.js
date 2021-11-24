import {Modal, Button} from 'react-bootstrap';
import React from "react";
import  { Suspense, lazy, useEffect, useState, useContext, useRef } from 'react'; 

const InfoModal =(props)=>{
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          G to Y Conversion File Uploader
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
           Every time new station history CSVs are loaded, the function that converts G to Y runs and a new conversion output file is generated. 
           The function looks at the PSA attribute CSV to determine which stations and parameters to use for each PSA and then pulls the station 
           history files to generate the G to Y file.  This is the file that controls what shows up on the comparison map. It takes the 
           function about 7 or 8 minutes to run. 
        </p>
        <p>Parameter names in the input file must be match those in the list below otherwise they will not be recognized.</p>
        <ul>
          <li>FFMC</li>
          <li>RHmin</li>
          <li>Tmin</li>
          <li>DMC</li>
          <li>ERC</li>
          <li>F10</li>
          <li>F100</li>
          <li>F1000</li>
        </ul>  


      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


export default InfoModal