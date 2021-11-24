import  { Suspense, lazy, useEffect, useState, useContext } from 'react'; 
import {Form, Col, Container, Button, Card, Row, Accordion, Alert} from 'react-bootstrap';
import { FormDataContext } from '../contexts/FormDataContext'

const FormAlert = () =>{
	const context = useContext(FormDataContext)
  const [showAlert, setShowAlert]=useState(true)
  const [alertText, setAlert] = useState('')
  const [alertVariant, setAlertVariant] = useState('success')

  return(
  	<Alert variant={alertVariant} show={showAlert} >Form submitted successfully </Alert>

  )
}
export default FormAlert