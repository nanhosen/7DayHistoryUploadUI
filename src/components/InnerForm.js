import { useEffect, useContext, useState, useRef } from 'react';
// import { useRef } from "react";
// import ImageUploader from 'react-images-upload'
import { FormDataContext } from '../contexts/FormDataContext'
import {Form, Card, Accordion, Button, Row, Col} from 'react-bootstrap';


const InnerForm = (props) => {
  // console.log('props', props)
  const context = useContext(FormDataContext)
  // console.log('context', context)
  useEffect(()=>{
    // console.log('context', context)
  },[context])
  const { handleChange, level, onDrop1, i, showPrevText } = props
  const [period1Text, setPeriod1Text] = useState('weird')
  const [period2Text, setPeriod2Text] = useState('nada')

  const ref1 = useRef()

  // console.log('props i ', i)
  // const levels = ['surface', '1000ft', '6000ft']
  // const types = ['image/png', 'image/jpeg', 'image/gif']
  const values = {}
  // const executeChange = (value, period, level){
  //   const sendObj = {}
  //   sendObj[$]
  // }

  useEffect(()=>{
    // console.log('showPrevText', showPrevText)
    if(showPrevText && context.previousText){
      setPeriod1Text()
      const p1Text = context.previousText[`l${i+1}p1Fcst`]
      const p2Text = context.previousText[`l${i+1}p2Fcst`]
      // console.log('p1Text', p1Text, context.previousText, `l${i+1}p1Fcst`, context['previousText'][`l${i+1}p1Fcst`])
      setPeriod1Text(p1Text)
      setPeriod2Text(p2Text)
      const newTextContext = context.textData
      newTextContext[`l${i+1}p1Fcst`] = p1Text
      newTextContext[`l${i+1}p2Fcst`] = p2Text
      newTextContext['p1Date'] = context.previousText.p1Date
      newTextContext['p2Date'] = context.previousText.p2Date
      context.setTextData(newTextContext)
      context.setChanged(context.changed+1)
    }
    else{
      setPeriod1Text('')
      setPeriod2Text('')
    }
  },[showPrevText, context.previousText])

  useEffect(() =>{
    // console.log('context', context)
  },[context])

  useEffect(()=>{
    // console.log('period text', period1Text, period2Text)
  },[period1Text, period2Text])

  return(
    <>
      <Card>
         <Card.Body>
          <Card.Title> {level} Info</Card.Title>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Period 1 Forecast Text</Form.Label>
              <Form.Control 
                ref = {ref1}
                as="textarea"  
                style={{ height: '75px' }} 
                value = {context['textData'][`l${i+1}p1Fcst`]}
                onChange={(event)=>(handleChange({[`l${i+1}p1Fcst`]: event.target.value}, i+1, 1, false))}
               />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Period 2 Forecast Text</Form.Label>
                <Form.Control 
                  as="textarea"  
                  style={{ height: '75px' }}  
                  value = {context['textData'][`l${i+1}p2Fcst`]}
                  onChange={(event)=>(handleChange({[`l${i+1}p2Fcst`]: event.target.value}, i+1, 1, false))}
                />
            </Form.Group>
          </Row>
        </Card.Body>
      </Card>
    </>
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