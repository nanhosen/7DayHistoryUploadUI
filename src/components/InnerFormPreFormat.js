import { useEffect, useContext } from 'react';
// import { useRef } from "react";
// import ImageUploader from 'react-images-upload'
import { FormDataContext } from '../contexts/FormDataContext'
import {Form, Card, Accordion, Button, Row, Col} from 'react-bootstrap';


const InnerForm = (props) => {
  // console.log('props', props)
  const context = useContext(FormDataContext)
  // console.log('context', context)
  useEffect(()=>{
    console.log('context', context)
  },[context])
  const { handleChange, level, onDrop1, i } = props
  // console.log('props i ', i)
  // const levels = ['surface', '1000ft', '6000ft']
  // const types = ['image/png', 'image/jpeg', 'image/gif']
  const values = {}
  // const executeChange = (value, period, level){
  //   const sendObj = {}
  //   sendObj[$]
  // }
  

  return(
              <Accordion.Item  variant="link" eventKey={`'${i}'`}>
                <Accordion.Header>
                
                  {level} Info (click to expand)
                </Accordion.Header>
                    <Accordion.Body>
                    <Row>
                      {/*<Form>*/}
                        <Form.Label><b>Period 1 Informgggation</b> </Form.Label>
                       
                          <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Description of the Forecast</Form.Label>
                            <Form.Control type="textarea"  value = "refill" onChange={(event)=>(handleChange({[`l${i+1}p1Fcst`]: event.target.value}, i+1, 1, false))}/>
                          </Form.Group>

                          <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Period 1 Image</Form.Label>
                            <Form.Control type="file" multiple onChange={(event)=>(handleChange(event.target.files, i+1, 1, true))}/>
                          </Form.Group>
 
                      <Form.Label><b>Period 2 Information</b> </Form.Label>

                          <Form.Group as={Col}  className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Description of the Forecast</Form.Label>
                            <Form.Control type="textarea"  multiple onChange={(event)=>(handleChange({[`l${i+1}p2Fcst`]: event.target.value}, i+1, 1, false))}/>
                          </Form.Group>

                          <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Period 2 Image</Form.Label>
                            <Form.Control type="file" multiple onChange={(event)=>(handleChange(event.target.files, i+1, 2, true))}/>
                          </Form.Group>    
                      {/*</Form>*/}
                      </Row>
                    </Accordion.Body>
              </Accordion.Item>
                  
            
  )
}


export default InnerForm


    // <Card>
    //     <Card.Body>
    //         <Card>
    //           <Accordion.Toggle className="bg-dark text-white" as={Card.Header} variant="link" eventKey={`'${i}'`}>
    //             {level} Info (click to expand)
    //           </Accordion.Toggle>
    //           <Accordion.Collapse eventKey= {`'${i}'`}>
    //             <Card.Body>
    //               <h5>Period 1 Information</h5>
    //               <Form.Group controlId="textDescription">  
    //                 <Form.Label>Description of the Forecast</Form.Label>
    //                   <Form.Group controlId="formFile" className="mb-3">
    //                     <Form.Label>Default file input example</Form.Label>
    //                     <Form.Control type="file" />
    //                   </Form.Group>
    //               </Form.Group>
  
    //               <Form.Group controlId="image1">
    //                 <Form.Label>Period 1 Image</Form.Label>
  
    //               </Form.Group>
    //               <hr />
    //               <h5>Period 2 Information</h5>
    //               <Form.Group controlId="textDescription">  
    //                 <Form.Label>Description of the Forecast</Form.Label>
    //                   <Form.Group controlId="formFile" className="mb-3">
    //                     <Form.Label>Default file input example</Form.Label>
    //                     <Form.Control type="file" />
    //                   </Form.Group>
    //               </Form.Group>
  
    //               <Form.Group controlId="image2">
    //                 <Form.Label>Period 2 Image</Form.Label>
  
    //               </Form.Group>
    //             </Card.Body>
    //           </Accordion.Collapse>  
    //         </Card>
            
    //       </Card.Body>
    // </Card>