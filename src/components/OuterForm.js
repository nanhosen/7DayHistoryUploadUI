// don't forget to loook at this it is a good example https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

import React from "react";
import  { Suspense, lazy, useEffect, useState, useContext, useRef } from 'react'; 
import axios from 'axios';
import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3"


import {Form, Col, Container, Button, Card, Row, Accordion, Alert, Spinner, CardGroup} from 'react-bootstrap';

// import useCustomForm from "./hooks/formHook";
import FileArea from "./FileArea";
import BucketContents from "./BucketContents";
import ConfigUpload from "./ConfigUpload";
import { FormDataContext } from '../contexts/FormDataContext'
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {fromCognitoIdentityPool} = require("@aws-sdk/credential-provider-cognito-identity");


const initialValues = {};






const OuterForm = () => {
  const context = useContext(FormDataContext)
  const [showAlert, setShowAlert]=useState(false)
  const [alertText, setAlert] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState()
  const [submitSuccessText, setSubmitSuccessText] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Submit')
  const [buttonColor, setButtonColor] = useState('dark')
  const [showPrevText, setShowPrevText] = useState(false)
  const [loadButtonText, setLoadButtonText] = useState('Load Previous Forecast Text')
  const [fileNames, setFileNames] = useState([])
  const [selectedGacc, setSelectedGacc] = useState(false)
  const [uploadConfig, setUploadConfig] = useState(false)


  const formRef= useRef(null)



  // useEffect(()=>{
  //   // console.log('context', context, 'hi', JSON.stringify(context.textData))
  //   // const { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text } = context
  //   // const newTextObj = { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text }
  //   // console.log('newTextObj', newTextObj)
  //   // setTextObj(newTextObj)
  // },[context])



  // useEffect(()=>{
  //   // console.log('submit success result', submitSuccess)
  // },[submitSuccess])

  // useEffect(()=>{
  //   // console.log('selectedGacc', selectedGacc)
  //   // const { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text } = context
  //   // const newTextObj = { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text }
  //   // console.log('newTextObj', newTextObj)
  //   // setTextObj(newTextObj)
  // },[selectedGacc])

  // useEffect(()=>{
  //   if(showPrevText){
  //     setLoadButtonText('Clear Forecast Text')

  //   }
  //   else{
  //     setLoadButtonText('Load Previous Forecast Text')
  //     context.setTextData({l1p1Fcst: null,
  //       l1p2Fcst: null,
  //       l2p1Fcst: null,
  //       l2p2Fcst: null,
  //       p1Date: null,
  //       p2Date: null})
  //     context.setChanged(context.changed + 1)
  //     console.log('the context for text should be clear now ugh')
  //   }
  // },[showPrevText])

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
  },[submitted])

  useEffect(()=>{
    const fileNameAr = []
    const fileAr = context.selectedCSVs
    var file
    for (var i = 0; i < fileAr.length; i++) {
        // get item
        file = fileAr[i];
        //or
        fileNameAr.push(file.name)


        // console.log('name', file.name);
    }
      setFileNames(fileNameAr)
  },[context.selectedCSVs])



  const levels = ['Surface', '6000ft']
  const day = [1,2]
  const types = ['image/png', 'image/jpeg', 'image/gif']

  const handleFileClick = (fileName, contextFiles, contextSetter) =>{
    console.log('fileName', fileName, 'contextFiles', contextFiles)
    const newContextFiles = []
    contextFiles.map(currContextFile =>{
      console.log('clicked name', fileName, 'context name', currContextFile.name)
      if(fileName !== currContextFile.name){
        newContextFiles.push(currContextFile)
      }
    })
    contextSetter(newContextFiles)
  }

  const handleChange = async(input, level, day, isfile) =>{
    // console.log('submitted1', submitted, 'showAlert', showAlert)

    if(submitted){
      setSubmitted(false)
    }
    if(!isfile){
      const newTextData = {...context.textData, ...input }
      // newTextData[`l${level}p${day}`] = input
      context.setTextData(newTextData)
    }
    else{
      console.log('I am a file so ai am doing file things', input)
      var i = 0
      const currSelectedCsvs = context.selectedCSVs
      const newSelectedCsvs = []
      for (var i = 0; i < input.length; i++) {
          // get item
          var file = input[i];
          //or
          // fileNameAr.push(file.name)
          if(fileNames.indexOf(file.name)<0){
            newSelectedCsvs.push(file)
          }


          console.log('name lower', file.name, fileNames.indexOf(file.name));
      }
      console.log('new csvs', newSelectedCsvs)
      context.setSelectedCSVs([...context.selectedCSVs, ...newSelectedCsvs])
      
      // for(var csvFile in input){
      //   console.log('i', i)
      //   const file = input[csvFile];
      //   console.log('file', file.name)

      //   // const newImageData = context.images
      //   // newImageData[`l${level}p${day}Test`] = input[0]
      //   // const fileLevelName = fileNameAr[i]
      //   // newImageData[fileLevelName] = input[i]

      //   // await uploadFile(file)
      //   // context.setLevel1Period1Image(file)
      //   // context.setImages(newImageData)
      //   i++
      // }
    }
    context.setChanged(context.changed+1)
    // console.log('handled change', newTextData, context)
  }
  // const imageRef = useRef()


  // const handleTextButton = ()=>{
  //   setShowPrevText(!showPrevText)
  // }





    const handleUploads = async(event, fileArray) =>{

      event.preventDefault()
      setIsLoading(true)
      // textData['updateTime'] = new Date()
      console.log('fileArray', fileArray)
      const uploadText = await uploadFile(fileArray)
      // for(var img in images){
      //   // console.log('doing img', img, images[img])
      //   if(images[img]){
      //     await uploadFile(images[img], false, true, img)
      //   }
      // }  
      console.log('done uploading')
      // context.setSubmitted(true)
      setShowAlert(true)
      setSubmitted(true)
      setIsLoading(false)
      formRef.current.reset()
    }

    const uploadFile = async(fileArray) => {
      // if(isText){
        console.log('uploadFile array', fileArray)
      const paramArray = []
      fileArray.map(currFile =>{
        paramArray.push({
          Bucket: '7dayconversion-inputs',
          // Bucket: 'smoke-webpage-data',
          // Specify the name of the new object. For example, 'index.html'.
          // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
          Key: `historyRAWS/${selectedGacc}/${currFile.name}`,
          // Key: `historyRAWS/${currFile.name}ttest`,
          // Key: `/historyRAWS/${selectedGacc}/testUploadFromApp.txt`,
          // Key: `${selectedGacc}testUploadFromApp.txt`,
          // Key: isText ? 'forecastText.json' : newName,
          // Content of the new object.
          // Content of the new object.
          Body: currFile
        })
      })


      // var  bucketParams = {
      //     Bucket: '7dayconversion-inputs',
      //     // Bucket: 'smoke-webpage-data',
      //     // Specify the name of the new object. For example, 'index.html'.
      //     // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      //     Key: `/historyRAWS/${selectedGacc}/testUploadFromApp.csv`,
      //     // Key: `/historyRAWS/${selectedGacc}/testUploadFromApp.txt`,
      //     // Key: `${selectedGacc}testUploadFromApp.txt`,
      //     // Key: isText ? 'forecastText.json' : newName,
      //     // Content of the new object.
      //     // Content of the new object.
      //     Body: 'test'
      //   };
      // }
      // else if(isFile){
      //   const fileName = input.name;
      //   const photoKey = fileName;
      //   bucketParams = {
      //     Bucket: 'smoke-webpage-data',
      //     // Specify the name of the new object. For example, 'index.html'.
      //     // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      //     Key: photoKey,
      //     // Content of the new object.
      //     Body: input
      //   };
      // }
      
      


      try {
        // const data = await s3Client.send(new PutObjectCommand(bucketParams));
        // console.log('paramArray', paramArray)
        const responses = await Promise.allSettled(
          paramArray.map(param => context.s3Client.send(new PutObjectCommand(param)))
        ) 

      // console.log('responses', responses) 
        // console.log('dataSend', data)
        // return data; // For unit tests.
        setButtonColor('success')
        setButtonText('Successfully Submitted')
        setTimeout(()=>(setButtonColor('dark')),3000)
        setTimeout(()=>(setButtonText('Submit')),3000)
        setSubmitSuccessText('Form Submitted Successfully')
        context.setSelectedCSVs([])
        context.setNumUploadSuccess(context.numUploadSuccess + 1)
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
    }


//     myBucket.putObject(params)
//         .on('httpUploadProgress', (evt) => {
//             setProgress(Math.round((evt.loaded / evt.total) * 100))
//         })
//         .send((err) => {
//             if (err) console.log(err)
//         })
// }

  // console.log('innerFormArray', innerFormArray)

  return (
    <>
      <Alert variant={submitSuccess == false ? 'danger' : 'success'} show={showAlert} >{submitSuccessText}</Alert>
      {/*<Form ref={formRef} onSubmit={(event)=>{handleUploads(event, context.selectedCSVs)}} className="App">*/}
      <Row>
        <CardGroup>
          <Card border="dark" classtyle={{ }}>
            <Card.Body>
              <Card.Title>PSA Config File</Card.Title>
              <Card.Text>
                <p>This file controls which stations and parameters are used to calculate thresholds for each PSA. The CSV must exactly match the format of the CSV that can be downloaded via the "Example Config Format" button link. </p>
                <p>The parameter names must match the names in the parameter list found in the "Page Info" section linked in the top right corner of the page</p>
              </Card.Text>

              <Card.Link href="https://7dayconversion-inputs.s3.us-east-2.amazonaws.com/PSA_Attributes_Example_Format.csv"><Button variant="dark">Example Config Format</Button></Card.Link>
              <Card.Link href="https://7dayconversion-inputs.s3.us-east-2.amazonaws.com/PSA_Attributes.csv"><Button variant="dark">Download Config</Button></Card.Link>
              <Card.Link href="#"><Button variant="dark" onClick={()=>setUploadConfig(true)}>Upload New Config File CSV</Button></Card.Link>
              <Card.Text style={{paddingTop: '10px'}}>
               {uploadConfig && <ConfigUpload />}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">Config File last updated: {new Date(context.configFileUpdateTime).toUTCString()}</Card.Footer>

          </Card>  
          <Card border="dark" style={{ }}>
            <Card.Body>
              <Card.Title>PSA Fuel Model Conversion Output File</Card.Title>
              <Card.Text>
                Output CSV file with thresholds for G and Y. This file is updated when either the config file or the station history files are modified.
              </Card.Text>
              <Card.Link href="#"><Button variant="dark" onClick={()=>console.log('clikced')}>Download G to Y Conversion Outputs</Button></Card.Link>
            </Card.Body>

            <Card.Footer className="text-muted">Output File last updated: {new Date(context.crosswalkUpdateTime).toUTCString()}</Card.Footer>
          </Card>  
        </CardGroup>  
      </Row>
        <Card border="dark">
          <Form ref={formRef} onSubmit={(event)=>{handleUploads(event, context.selectedCSVs)}} className="App">
            <Card.Body>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Card.Title>
                    Upload New Station History CSV File
                  </Card.Title>
                  <Card.Subtitle className="mb-1 text-muted">Select a GACC for Upload Options </Card.Subtitle>  
                  <Form.Select size="lg" aria-label="Default select example" onChange={(e) =>{e.target.value.length <7 ?setSelectedGacc(e.target.value) : setSelectedGacc(null)}}>
                    <option>Select a GACC</option>
                    <option value="AICC">AICC</option>
                    <option value="EACC">EACC</option>
                    <option value="GBCC">GBCC</option>
                    <option value="NRCC">NRCC</option>
                    <option value="NWCC">NWCC</option>
                    <option value="ONCC">ONCC</option>
                    <option value="OSCC">OSCC</option>
                    <option value="RMCC">RMCC</option>
                    <option value="SACC">SACC</option>
                    <option value="SWCC">SWCC</option>
                  </Form.Select>
                </Form.Group>

              </Row>
                {selectedGacc && <FileArea GACC = {selectedGacc}/>  }
                <Button variant={buttonColor} type="submit" className="mt-1" disabled={context.selectedCSVs.length > 0 ? false : true}>
                  {isLoading && <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />}
                  {buttonText}
                  
                </Button>
            </Card.Body>
          </Form>
        </Card>  
      {selectedGacc && <BucketContents GACC = {selectedGacc}/>}
       
    </>  
  );
};

export default OuterForm;

// {context.selectedCSVs.value > 0 
//                 ? <Button variant={buttonColor} type="submit" className="mt-1" disabled>
//                 : <Button variant={buttonColor} type="submit" className="mt-1" disabled>
//               }