import { useSelector } from 'react-redux'
import { useRef, useState, useEffect  } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Profile() {

  const {currentUser} = useSelector((state) =>state.user)
  const fileRef = useRef(null)
  const [file,setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})
 

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
        <img src={formData.avator || currentUser.avator} alt="" 
        onClick={()=> fileRef.current.click()}
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center shadow-lg'/>
        
        <p className='text-center'>
          { filePercentage > 0 && filePercentage < 100 ?  ( <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>) :
            filePercentage === 100 ? ( <span className='text-green-700'> Image successfully uploaded</span> ) : "" 
          }
        </p>
       
        
        <input type="text" placeholder='Username' id="username" className='border p-3 rounded-lg ' />

        <input type="text" placeholder='email' id="email" className='border p-3 rounded-lg ' />

        <input type="text" placeholder='password' id="password" className='border p-3 rounded-lg ' />

        <button className='bg-sky-950 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>

        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete Account ?</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
      </form>

      {fileError  &&  <ToastContainer />}
    </div>
  )
}
