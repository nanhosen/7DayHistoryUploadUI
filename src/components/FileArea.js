// don't forget to loook at this it is a good example https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

import React from "react";
import  { Suspense, lazy, useEffect, useState, useContext, useRef } from 'react'; 
import axios from 'axios';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"




import {Form, Col, Container, Button, Card, Row, Accordion, Alert, Spinner} from 'react-bootstrap';

// import useCustomForm from "./hooks/formHook";
import InnerForm from "./InnerForm";
import { FormDataContext } from '../contexts/FormDataContext'
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {fromCognitoIdentityPool} = require("@aws-sdk/credential-provider-cognito-identity");


const initialValues = {};




const FileArea = (props) => {
  const context = useContext(FormDataContext)
  const [showAlert, setShowAlert]=useState(false)
  const [alertText, setAlert] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Submit')
  const [buttonColor, setButtonColor] = useState('dark')
  const [showPrevText, setShowPrevText] = useState(false)
  const [loadButtonText, setLoadButtonText] = useState('Load Previous Forecast Text')
  const [fileNames, setFileNames] = useState([])

  const currGacc = props.GACC
  // console.log('currGacc', currGacc)
  const formRef= useRef(null)



  useEffect(()=>{
    console.log('context', context, 'hi', JSON.stringify(context.textData))
    // const { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text } = context
    // const newTextObj = { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text }
    // console.log('newTextObj', newTextObj)
    // setTextObj(newTextObj)
  },[context])

  useEffect(()=>{
    if(showPrevText){
      setLoadButtonText('Clear Forecast Text')

    }
    else{
      setLoadButtonText('Load Previous Forecast Text')
      context.setTextData({l1p1Fcst: null,
        l1p2Fcst: null,
        l2p1Fcst: null,
        l2p2Fcst: null,
        p1Date: null,
        p2Date: null})
      context.setChanged(context.changed + 1)
      // console.log('the context for text should be clear now ugh')
    }
  },[showPrevText])

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
    // console.log('fileName', fileName, 'contextFiles', contextFiles)
    const newContextFiles = []
    contextFiles.map(currContextFile =>{
      // console.log('clicked name', fileName, 'context name', currContextFile.name)
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
      // console.log('I am a file so ai am doing file things', input)
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


          // console.log('name lower', file.name, fileNames.indexOf(file.name));
      }
      // console.log('new csvs', newSelectedCsvs)
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

          

          <Card>
            <Card.Body>  
              <Form.Group controlId="formFile" className="mb-3">
                <Card.Title>
                  <Form.Label>Upload Files</Form.Label>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">File name must be in the format: [stationid]_daily_listing_[fuelmodel].csv (For example: 210509_daily_listing_Y.csv)<br />Multile files can be selected by holding down Shift and clicking on the first and last file in a selected range.  </Card.Subtitle>  
                <Form.Control type="file" multiple onChange={(event)=>(handleChange(event.target.files, 3, 2, true))}/>
              </Form.Group>   
            </Card.Body>
          </Card>   
          <Card>
            <Card.Body>
              <Card.Title>
                Files Selected for Upload 
              </Card.Title> 
              <Card.Subtitle className="mb-1 text-muted">Files can be removed from the list by clicking on the filename. </Card.Subtitle>  

              {fileNames.map((currFile,i) => <Button variant="outline-dark" key={i} onClick={()=>handleFileClick(currFile, context.selectedCSVs, context.setSelectedCSVs)}>x {currFile}</Button>)}
            </Card.Body>
          </Card>
          
    </>  
  );
};

export default FileArea;

