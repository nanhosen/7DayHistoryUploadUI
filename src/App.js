import React from "react";
import  { Suspense, lazy, useEffect, useState, useContext } from 'react'; 



import {Container} from 'react-bootstrap';

// import useCustomForm from "./hooks/formHook";
import InfoModal from "./components/InfoModal";
import NavbarTop from "./components/NavbarTop";
import OuterForm from "./components/OuterForm";
import { FormDataContext } from './contexts/FormDataContext'
const FormDataProvider = lazy(() => import('./providers/FormDataProvider'))



const App = () => {
  const context = useContext(FormDataContext)

  const [textObj, setTextObj] = useState({})
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(()=>{
    // console.log('context', context, 'hi', context.day1Period1Text)
    const { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text } = context
    const newTextObj = { day1Period1Text, day1Period2Text, day2Period1Text, day2Period2Text }
    // console.log('newTextObj', newTextObj)
    setTextObj(newTextObj)
  },[context])

  useEffect(() =>{
    // console.log('textObj', textObj)
  },[textObj])



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
    <Container>
      <NavbarTop setter={setModalShow}/>
      <div className="bg-light p-5 rounded-lg mb-1" style={{color: 'white', backgroundImage: `url("https://gacc.nifc.gov/gbcc/predictive/7daycompare/upload-form/bgforest.jpg")`}}>
        <h1> Upload Station History Files </h1>
      </div> 
      <Suspense fallback={'...Loading'}>
        <FormDataProvider>
          <InfoModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <OuterForm />
        </FormDataProvider>
      </Suspense>  
    </Container>
    
  );
};

export default App;

