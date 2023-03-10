import React, {Fragment, useState, useEffect} from 'react';
import axios from 'axios';
import Modal from 'react-modal'

//  const API_URL_SERVER = "http://localhost:3310/";
const API_URL_SERVER = "http://sulbaranjc.com:3310/";
// const API_URL_SERVER = "http://192.168.1.147:3310/";
const API_TABLA_CONTROLLER = "images/";
const API_TOTAL_CONTROLLER = API_URL_SERVER+API_TABLA_CONTROLLER;
function App() {

  const [file, setFile] = useState(null)
  const [imageList, setimageList] = useState([])
  const [listUpdate, setListUpdate] = useState(false)
  
  
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  
const modalHandler = (isOpen,img) => {
  setModalIsOpen(isOpen)
  setCurrentImage(img)
} 


  useEffect(() =>{
    Modal.setAppElement('body')
    cargarImagenes()
    setListUpdate(false)
  }, [listUpdate])

  

  const cargarImagenes = async() => {
    const response = await axios.get(API_TOTAL_CONTROLLER)
    // sort and reverse images
    const sortedImages = response.data.sort().reverse()
    setimageList(sortedImages)
  }
  const selectedhandler = e =>{
    setFile(e.target.files[0])
  }

  const sendHandler = e =>{
    if(!file){
      alert('debes escojer un archivo')
      return
    }

  const formdata = new FormData()
    formdata.append('image',file)
    fetch(API_TOTAL_CONTROLLER,{
      method: 'POST',
      body: formdata
    })
    .then (res => res.text())
    .then (res => {
      setListUpdate(true)
    })
    .catch(err =>{
      console.log(err)
    })
    document.getElementById('fileinput').value = null
    setFile(null)
  }



const deleteHandler = async() => {
  // console.log(currentImage)
  // console.log(currentImage.split('-'))
    let imageID = currentImage.split('-')
    imageID = imageID[1].split('.')
    imageID = parseInt(imageID[0]) 
    // console.log(imageID)
    const res = await axios.delete(API_TOTAL_CONTROLLER+imageID)
    console.log(res.data)
    setModalIsOpen(false)

    setListUpdate(true)
  }


  return (
    <Fragment>
      <nav className='navbar navbar-dark bg-dark'>
        <div className='container'>
          <a href="#!" className='navbar-drand'>Image App</a>
        </div>
      </nav>
      <div className='container mt-5'>
        <div className="card p-3">
          <div className="row ">
            <div className="col-12 col-md-10  ">
              <input id='fileinput' onChange ={selectedhandler} className="form-control" type="file" />
            </div>
            <div className="col-12 col-md-2 ">
              <button onClick={sendHandler} type='button' className='btn btn-primary col-12'>Upload</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-3 d-flex flex-wrap justify-content-center ">
        {imageList.map(image =>(
        <div key = {image} className="card m-2">
          <img className='card-img-top' src={API_URL_SERVER + image} alt="..." style={{heigth :"200px", width : "300px"}}/>
          <div className='card-body d-flex align-items-end'>
            <button onClick={() => modalHandler(true,image)} className='btn btn-dark col-12'>Ver</button>
          </div>
        </div>
        ))}
     </div>

   <Modal style={{content : {right: "20%", left: "20%", top: "20%", bottom: "20%"}}} isOpen={modalIsOpen} onRequestClose={()=> setModalIsOpen(false)}>
    <div className="card">
      <img className="mx-auto" src={API_URL_SERVER + currentImage} alt="..."  style={{heigth :"300px", width : "400px"}}/>
      <div className="card-body">
      <button onClick={() => deleteHandler()}  className='btn btn-danger col-12'>Delete</button>
      </div>
    </div>
   </Modal>

   </Fragment>
  );
}

export default App;
