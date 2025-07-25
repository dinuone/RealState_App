import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion"
import OAuth from '../compoenents/OAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({})
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  
  const notifyError = (err) =>{
    toast.error(err, {
      theme: "colored",
      position: toast.POSITION.BOTTOM_CENTER
    });
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    });
  }

  const  handleSubmit = async (event)=>{

    try{
      event.preventDefault()
      setLoading(true) //set loading to true
      
      const response = await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'content-type': 'application/json',
        },
        body:JSON.stringify(formData)
      })
  
      const data = await response.json()
      if(data.success === false) {
        setError(data.message)
        notifyError(data.message)
        setLoading(false) //set loading to false
        return
      }
  
      setLoading(false) //set loading to false
      setError(null)
      navigate('/sign-in')
    
    }catch(err){
      setLoading(false) //set
      setError(err.message)
      notifyError(data.message)
    }

   
   
  }


  return (
    <AnimatePresence>
      <motion.div className='p-3 max-w-lg mx-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <h1 className='text-sky-950 text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input type="text" placeholder='username' className='border p-3 rounded-lg' id="username"  onChange={handleChange}/>
          
          <input type="email" placeholder='email' className='border p-3 rounded-lg' id="email"  onChange={handleChange}/>
          
          <input type="password" placeholder='password' className='border p-3 rounded-lg' id="password"  onChange={handleChange}/>
          
          <button disabled={loading} className='bg-sky-950 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          
          {/* sign with google */}
          <OAuth/> 
        </form>

        <div className='flex gap-2 mt-5'>
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className='text-blue-700'>Sing in</span>
          </Link>
        </div>
        {error &&  <ToastContainer />}
      </motion.div>
    </AnimatePresence>
  )
}
