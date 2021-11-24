// don't forget to loook at this it is a good example https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

import React from "react";
import  {useEffect, useState, useContext, useRef } from 'react'; 
import {  PutObjectCommand } from "@aws-sdk/client-s3"



// const S3_BUCKET ='YOUR_BUCKET_NAME_HERE';
// const REGION ='YOUR_DESIRED_REGION_HERE';



import {Form,   Button,    Alert, Spinner} from 'react-bootstrap';

// import useCustomForm from "./hooks/formHook";
import InnerForm from "./InnerForm";
import { FormDataContext } from '../contexts/FormDataContext'


const ConfigUpload = (props) => {
  const context = useContext(FormDataContext)
  const [showAlert, setShowAlert]=useState(false)
  const [alertText, setAlert] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState()
  const [submitSuccessText, setSubmitSuccessText] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Submit')
  const [buttonColor, setButtonColor] = useState('dark')
  const [loadButtonText, setLoadButtonText] = useState('Load Previous Forecast Text')
  const [uploadedFile, setUploadedFile] = useState()

  const formRef= useRef(null)





  useEffect(() =>{
    if(isLoading){
      setButtonText('  Submitting Data....')
      setButtonColor('secondary')
    }

  },[isLoading])



  useEffect(()=>{
    // console.log('submitted changed', submitted)
    if(submitted){
      setShowAlert(true)
      setIsLoading(false)
      setTimeout(()=>(setShowAlert(false)),4000)

    }
    if(!submitted && showAlert){
      setShowAlert(false)
      setButtonColor('dark')
    }
  },[submitted, showAlert])






  const handleChange = async(input, level, day, isfile) =>{
    // console.log('submitted1', submitted, 'showAlert', showAlert)

    if(submitted){
      setSubmitted(false)
    }
   
    // console.log('I am a file so ai am doing file things from config part', input)
        // get item
      var file = input[0];
      if(file){
        // console.log('this is going in the file sttate', file.length, file)
        setUploadedFile(file)
      }
  }


const uploadFile = async(event, file) => {
      // if(isText){
        // console.log('file file fongig config upload', file)
        event.preventDefault()
        setIsLoading(true)
        var param = {
          Bucket: '7dayconversion-inputs',
          Key: `PSA_Attributes.csv`,
          // Key: `historyRAWS/${currFile.name}ttest`,
          // Key: `/historyRAWS/${selectedGacc}/testUploadFromApp.txt`,
          // Key: `${selectedGacc}testUploadFromApp.txt`,
          // Key: isText ? 'forecastText.json' : newName,
          // Content of the new object.
          // Content of the new object.
          Body: 'test'
        }


      try {
        // const data = await context.s3Client.send(new PutObjectCommand(bucketParams));
        console.log('param', param)
        const response = await context.s3Client.send(new PutObjectCommand(param))


      console.log('responses', response) 
        // console.log('dataSend', data)
        // return data; // For unit tests.
        setButtonColor('success')
        setButtonText('Successfully Submitted')
        setTimeout(()=>(setButtonColor('dark')),3000)
        setTimeout(()=>(setButtonText('Submit')),3000)
        setSubmitSuccessText('Form Submitted Successfully')
        // console.log('returned status', data)
        // console.log(
        //   "Successfully uploaded object: " +
        //     bucketParams.Bucket +
        //     "/" +
        //     bucketParams.Key
        // );
      } catch (err) {
        console.log("Error", err, JSON.stringify(err));
        setSubmitSuccessText('Submit Failed')
        setSubmitSuccess(false)
        setButtonColor('danger')
        setTimeout(()=>(setButtonColor('dark')),3000)
        setTimeout(()=>(setButtonText('Submit')),3000)
      }
      finally{
        setShowAlert(true)
        setSubmitted(true)
        setIsLoading(false)
        formRef.current.reset()
      }
    }

  return (
    <>

          

            <Form ref={formRef} onSubmit={(event)=>{uploadFile(event, uploadedFile)}} className="App">
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" onChange={(event)=>(handleChange(event.target.files))}/>
              </Form.Group>  
               <Button variant={buttonColor} type="submit" style={{marginTop:'1px'}} className="mt-1" disabled={uploadedFile ? false : true}>
                  {isLoading && <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />}
                  {buttonText}
                  
                </Button>
              </Form> 

          
    </>  
  );
};

export default ConfigUpload;

