import { useSelector } from 'react-redux'
import { useRef, useState, useEffect  } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { motion, AnimatePresence } from "framer-motion"

import { 
  updateStart,
  updateUserSuccess,
  updateFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure, 
  signOutStart, 
  signOutSuccess, 
  signOutFailure } from '../redux/user/userSlice.js';

import { useDispatch } from 'react-redux';

export default function Profile() {

  const {currentUser, loading, error} = useSelector((state) =>state.user)
  const fileRef = useRef(null)
  const [file,setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})

  const [updateNotification, setUpdateNotification] = useState(false)

  const dispatch = useDispatch()

  useEffect(()=>{
    if(file){
      handleFileupload(file);
    }
  }, [file])

  const notifyError = (err) =>{
    toast.error(err, {
      theme: "colored",
      position: toast.POSITION.TOP_CENTER
    });
  }

  const notifySuccess = (msg) =>{
    toast.success(msg, {
      theme: "colored",
      position: toast.POSITION.TOP_CENTER
    });
    setUpdateNotification(true)
  }

  const handleFileupload = (file) =>{
    const storage = getStorage(app)
    const filename = new Date().getTime() + file.name;
    const storageref = ref(storage,filename)
    const uploadTask = uploadBytesResumable(storageref,file);

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress))
      },

      (error)=>{
        setFileError(true)
        notifyError("File upload failed")
      },
  
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setFormData({...formData, avator:downloadURL})  
        })
      }
    
      );

   
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        dispatch(updateStart())

        const res = await fetch(`api/user/update/${currentUser._id}`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if(data.success === false){
          dispatch(updateFailure(data.message));
          notifyError(data.message)
          return
        }

        dispatch(updateUserSuccess(data))
        notifySuccess("Successfully updated")

      }catch(err) {
        dispatch(updateFailure(err.message))
      }

  }


  const handleChange = (event) => {
    setFormData({...formData,[event.target.id]:event.target.value})
  }

  const handleDeleteUser = async (event) => {
    try{
        dispatch(deleteUserStart())

        const res = await fetch(`/api/user/delete/${currentUser._id}`,{
          method: 'DELETE',
        })

        const data = await res.json()
        if(data.success === false) {
          dispatch(deleteUserFailure(data.message))
          return
        }

        dispatch(deleteUserSuccess(data))
        
    }catch(err){
        dispatch(deleteUserFailure(err.message))
    }
  }

  const handleSignOut = async () => {
    try{
      dispatch(signOutStart())
      const response = await fetch('api/auth/signout')
      const data = await response.json()

      if(data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }

      dispatch(signOutSuccess(data))

    }catch(err){
      dispatch(signOutFailure(err.message))
    }
  }

  return (
    <AnimatePresence>
      <motion.div className='p-3 max-w-lg mx-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
          <img src={formData.avator || currentUser.avator} alt="" referrerPolicy="no-referrer"
          onClick={()=> fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center shadow-lg'/>
          
          <p className='text-center'>
            { filePercentage > 0 && filePercentage < 100 ?  ( <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>) :
              filePercentage === 100 ? ( <span className='text-green-700'> Image successfully uploaded</span> ) : "" 
            }
          </p>
        
          
          <input type="text" placeholder='Username' id="username" className='border p-3 rounded-lg' 
          defaultValue={currentUser.username} 
          onChange={handleChange}
          />

          <input type="text" placeholder='email' id="email" className='border p-3 rounded-lg ' 
          defaultValue={currentUser.email}
          onChange={handleChange} />

          <input type="password" placeholder='password' id="password" className='border p-3 rounded-lg ' onChange={handleChange}/>

          <button disabled={loading} className='bg-sky-950 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Update'}
          </button>

          <div className='flex justify-between mt-5'>
            <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account ?</span>
            <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
          </div>
        </form>
          
        {fileError  &&  <ToastContainer />}
        {updateNotification && <ToastContainer />}
        {error && <ToastContainer /> }
      </motion.div>
    </AnimatePresence>
  )
}
