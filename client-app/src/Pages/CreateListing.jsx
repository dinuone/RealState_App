import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom'
 

export default function CreateListing() {

  const  {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();

  const [files,setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls:[],
    name:"",
    description:"",
    address:"",
    type:"rent",
    bedRooms:1,
    bathRooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
  })

  const [imageUploadError, setImageUploadError] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)


  const  handleImageSubmit = ()=>{
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
        setImageUploading(true)
        setImageUploadError(false)
        const promises = [];

        for (let i = 0; i < files.length; i++){
            promises.push(storeImage(files[i]))
        }

       Promise.all(promises).then((urls) => {
            setFormData({
                ...formData, 
                imageUrls: formData.imageUrls.concat(urls)
            });
            setImageUploadError(false)
            setImageUploading(false)
       
        }).catch((error) => {
         setImageUploadError(true)
         setImageUploading(false)
         notifyError("Image upload failed (2mb max per image")
       })
    }else{
        setImageUploadError(true)
        setImageUploading(false)
        notifyError("you can only upload 6 images")
    }
  }

  const notifyError = (err) =>{
    toast.error(err, {
      theme: "colored",
      position: toast.POSITION.TOP_CENTER
    });
  }

  const storeImage = async (file) =>{
    return new Promise((resolve, reject) =>{
        const storage = getStorage(app)
        const filename = new Date().getTime() + file.name;
        const storageref = ref(storage,filename)
        const uploadTask = uploadBytesResumable(storageref,file);

        uploadTask.on('state_changed',
        (snapshot)=>{
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(progress)
        },

        (error)=>{
            reject(error)
        },

        ()=>{
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            resolve(downloadURL)
           })
        }
        )

    })
  }

  const handleRemoveImage = (index) =>{
    setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_,i) => i !== index)
    })
  }

  const handleChange = (event) =>{
    if(event.target.id === 'sale' || event.target.id === 'rent'){
        setFormData({
            ...formData,
            type:event.target.id
        })
    }

    if(event.target.id ==='parking' || event.target.id === 'furnished' || event.target.id === 'offer'){
        setFormData({
            ...formData,
            [event.target.id]:event.target.checked
        })
    }

    if(event.target.type === 'number' || event.target.type === 'text' || event.target.type === 'textarea'){
        setFormData({
            ...formData,
            [event.target.id]:event.target.value
        })
    }
  }

  const handleSubmit = async (event)=>{
    event.preventDefault()

    try{
        if(formData.imageUrls.length < 1) {
            setError("you must upload at least one image") 
            setError(true)
            notifyError("you must upload at least one image")
            return
        } 

        if(formData.regularPrice < +formData.discountPrice){
            setError("Discount price must be lower than regular price") 
            setError(true)
            notifyError("Discount price must be lower than regular price")
            return
        }
        setLoading(true)
        setError(false)

        const res = await fetch('api/listing/create',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                userRef:currentUser._id
            }),
        })

        const data = await res.json()
        if(data.sucess === false){
            setError(data.message)
            notifyError(data.message)
            setLoading(false)
            return
        }

        setLoading(false)
        navigate(`/listing/${data._id}`)

    }catch(err){
        setError(err.message)
        notifyError(data.message)
        setLoading(false)
    }
  }

  return (
    <AnimatePresence>
        <motion.div className='p-3 max-w-4xl mx-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className='text-3xl font-semibold text-center my-7 text-gray-400'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input 
                    onChange={handleChange}
                    value={formData.name}
                    type="text" 
                    placeholder='Name' 
                    className='border p-3 rounded-lg' 
                    id="name" 
                    maxLength='62' 
                    minLength="10" 
                    required />

                    <textarea 
                    onChange={handleChange}
                    value={formData.description}
                    type="text" 
                    placeholder='Description'
                    className='border p-3 rounded-lg' 
                    id="description"  
                    required />

                    <input 
                     onChange={handleChange}
                     value={formData.address}
                     type="text"
                     placeholder='Address' 
                     className='border p-3 rounded-lg' 
                     id="address" 
                     maxLength='62' 
                     minLength="10" 
                     required />
                    
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" onChange={handleChange} checked={formData.type === 'sale'} id="sale" className='w-5'/>
                            <span>Sell</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox"  onChange={handleChange} checked={formData.type === 'rent'}  id="rent" className='w-5'/>
                            <span>Rent</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox"  onChange={handleChange} checked={formData.parking} id="parking" className='w-5'/>
                            <span>Parking Spot</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox"  onChange={handleChange} checked={formData.furnished} id="furnished" className='w-5'/>
                            <span>Furnished</span>
                        </div>

                        
                        <div className='flex gap-2'>
                            <input type="checkbox" onChange={handleChange} checked={formData.offer}  id="offer" className='w-5'/>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-6'>
                        <div className='flex flex-col items-center gap-2'>
                            <input 
                            onChange={handleChange}
                            value={formData.bedRooms}
                            className='p-3 rounded-lg border border-gray-300' 
                            type="number" id="bedRooms" min="1" max="10" required />
                            <p>Beds</p>
                        </div>

                        <div className='flex flex-col items-center gap-2'>
                            <input 
                             onChange={handleChange}
                             value={formData.bathRooms}
                            className='p-3 rounded-lg border border-gray-300' 
                            type="number" id="bathRooms" min="1" max="10" required />
                            <p>Baths</p>
                        </div>

                        <div className='flex flex-col items-center gap-2'>
                            <input 
                            onChange={handleChange}
                            value={formData.regularPrice}
                            className='p-3 rounded-lg border border-gray-300' 
                            type="number" id="regularPrice" min="50" max="1000000" required />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div> 
                        </div>

                        {formData.offer && (
                            <div className='flex flex-col items-center gap-2'>
                                <input 
                                onChange={handleChange}
                                value={formData.discountPrice}
                                className='p-3 rounded-lg border border-gray-300' 
                                type="number" id="discountPrice" min="0" max="1000000" required />
                                <div className='flex flex-col items-center'>
                                    <p>Discount Price</p>
                                    <span className='text-xs'>($ / Month)</span>
                                </div> 
                            </div>
                        )}
                        
                    </div>

                </div>

                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images :<span className='font-normal text-gray-600 ml-2'>Thes first image will be the cover (max 6)</span> </p>

                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 w-full' type="file" id="images" accept='image/*' multiple />
                        <button disabled={imageUploading} type="button" onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                            {imageUploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div  className='flex justify-between p-3 border items-center' key={url}>
                                <img src={url} className='w-20 h-20 object-contain rounded-lg' alt="listing image" />
                                <button onClick={()=> handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Delete</button>
                            </div>
                        ))
                    }

                    <button disabled={loading || imageUploading} className='p-3 bg-sky-950 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        { loading ? 'Creating...' : 'Create Lisitng'}
                    </button>
                </div>
            
            </form>
            {imageUploadError && <ToastContainer /> }
            {error && <ToastContainer />}
        </motion.div>
    </AnimatePresence>
  )
}
