import React, { useState, useEffect } from 'react'
import { FormDataContext } from '../contexts/FormDataContext'
import axios from 'axios'
import { S3Client, DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3"
// import { LambdaClient, GetFunctionCommand, GetFunctionEventInvokeConfigCommand } from "@aws-sdk/client-lambda";
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {fromCognitoIdentityPool} = require("@aws-sdk/credential-provider-cognito-identity");


export default function FormDataProvider({ children }) {
	const initState = {
		l1p1:null,
		l1p2:null,
		l2p1:null,
		l2p2:null
	}
	const initStateText = {
		p1Date:null, 
		p2Date:null,
		l1p1Fcst:null,
		l1p2Fcst:null,
		l2p1Fcst:null,
		l2p2Fcst:null,
		updateTime:new Date()
	}


	const [level1Period1Image, setLevel1Period1Image] = useState()
	const [changed, setChanged] = useState(0)
	const [images, setImages] = useState({...initState})
	const [textData, setTextData] = useState(initStateText)
	const [submitted, setSubmitted] = useState(false)
	const [previousText, setPreviousText] = useState()
	const [selectedCSVs, setSelectedCSVs] = useState([])
	const [numUploadSuccess, setNumUploadSuccess] = useState(0)
	const [configFileUpdateTime, setConfigFileUpdateTime] = useState(0)
	const [crosswalkUpdateTime, setCrosswalkUpdateTime] = useState(0)

	const config = {
	  region: 'us-east-2',
	  credentials: fromCognitoIdentityPool({
	    client: new CognitoIdentityClient({ region: 'us-east-1' }),
	    identityPoolId: process.env.REACT_APP_IDENTITY_ID,// IDENTITY_POOL_ID,
	    logins:{}
	  }),

	}

	const s3Client = new S3Client(config);
	// const lambdaClient = new LambdaClient(config);

	// console.log('LambdaClient', lambdaClient)

	useEffect(()=>{
		(async()=>{
			const previousText = await axios.get('https://smoke-webpage-data.s3.us-east-2.amazonaws.com/forecastText.json')
			if(previousText && previousText.data){
				setPreviousText(previousText.data)
			}

			// const lambdaCommandConfig = new GetFunctionCommand({FunctionName:'7DayCrosswalk-dev'})
			// const responseConfigLambda = await s3Client.send(lambdaCommandConfig)
			// console.log('responseConfigLambda', responseConfigLambda)

			const commandConfig = new ListObjectsCommand({Bucket: '7dayconversion-inputs' })
      const responseConfig = await s3Client.send(commandConfig)
      if(responseConfig.Contents && responseConfig.Contents.length > 0){
      	responseConfig.Contents.map(currResp =>{
      		const currFileName = currResp.Key
      		if(currResp.Key == 'PSA_Attributes.csv'){
      			setConfigFileUpdateTime(currResp.LastModified)
      			// console.log('currResp.LastModified', currResp, currResp.LastModified)
      		}
      	})
      }
      // console.log('list responseConfig provider', responseConfig)

      const commandOutput = new ListObjectsCommand({Bucket: '7daydata' })
      const responseOutput = await s3Client.send(commandOutput)
      if(responseOutput.Contents && responseOutput.Contents.length > 0){
      	responseOutput.Contents.map(currResp =>{
      		if(currResp.Key == 'GtoY/crosswalkInfo.csv'){
      			setCrosswalkUpdateTime(currResp.LastModified)
      			// console.log('setCrosswalkUpdateTime.LastModified', currResp, currResp.LastModified)
      		}
      	})
      }

			
				})()
	},[])

	


	  return (
	    <FormDataContext.Provider value={{ configFileUpdateTime, crosswalkUpdateTime, s3Client, setTextData, textData, changed, setChanged, images, setImages, previousText, selectedCSVs, setSelectedCSVs, numUploadSuccess, setNumUploadSuccess }}>
	          {children}
	    </FormDataContext.Provider>
	  );
}

 