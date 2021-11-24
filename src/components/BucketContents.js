// don't forget to loook at this it is a good example https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

import React from "react";
import  { useEffect, useState, useContext } from 'react'; 
import { DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3"




import {Button, Card} from 'react-bootstrap';

// import useCustomForm from "./hooks/formHook";
import { FormDataContext } from '../contexts/FormDataContext'



const BucketContents = (props) => {
  const {GACC} = props
  const context = useContext(FormDataContext)
  const [fileList, setFileList] = useState([])
  const [deleted, setDeleted] = useState(0)

  const handleFileClick = async(file) =>{
    // console.log(file.Key)
    if(file && file.Key){
      const command = new DeleteObjectCommand({Bucket: '7dayconversion-inputs', Key:file.Key })
      const response = await context.s3Client.send(command)
      setDeleted(deleted + 1)
      console.log('list delete response', response)
    }
    // console.log('fileName', fileName, 'contextFiles', contextFiles)
    // const newContextFiles = []
    // contextFiles.map(currContextFile =>{
    //   console.log('clicked name', fileName, 'context name', currContextFile.name)
    //   if(fileName !== currContextFile.name){
    //     newContextFiles.push(currContextFile)
    //   }
    // })
    // contextSetter(newContextFiles)
  }

    useEffect(()=>{
    (
      async()=>{
      // console.log('props, deleted, context.numUploadSuccess', props, deleted, context.numUploadSuccess)
        if(GACC){
          const command = new ListObjectsCommand({Bucket: '7dayconversion-inputs', Prefix:`historyRAWS/${GACC}` })
          const response = await context.s3Client.send(command)
          // console.log('list response', response)
          if(response){
            setFileList(response.Contents ? response.Contents : [])
          }
        }
      }
    )()
    // const responses = await Promise.allSettled(
    //       paramArray.map(param => context.s3Client.send(new PutObjectCommand(param)))
    //     ) 


  },[props, deleted, context.numUploadSuccess, GACC, context.s3Client])



  return (
    <>
      
          <Card border="dark">
            <Card.Body>  
                <Card.Title>
                  Currently Uploaded Stations
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Click on Station to Remove</Card.Subtitle>  
                {fileList.map((currFile,i) => <Button variant="outline-dark" key={i} onClick={()=>handleFileClick(currFile)}>x {currFile.Key.split("/")[2]}</Button>)}
            </Card.Body>
          </Card>    

    </>  
  );
};

export default BucketContents;

