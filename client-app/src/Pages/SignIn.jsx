import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

import { motion, AnimatePresence } from "framer-motion"
import OAuth from '../compoenents/OAuth';


export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({})
  const {loading,error} = useSelector((state)=>state.user)

  
  const notifyError = (err) =>{
    toast.error(err, {
      theme: "colored",
      position: toast.POSITION.TOP_CENTER
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
      event.preventDefault()//set loading to true
      dispatch(signInStart())
      const response = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'content-type': 'application/json',
        },
        body:JSON.stringify(formData)
      })
  
      const data = await response.json()
      if(data.success === false) {
        dispatch(signInFailure(data.message))
        notifyError(data.message)  
        return
      }
  
      dispatch(signInSuccess(data)) //set loading to false
      navigate('/') //navigate to home page
    
    }catch(err){
      dispatch(signInFailure(err.message))
      notifyError(err.message)
    }

   
   
  }


  return (
    <AnimatePresence>
      <motion.div className='p-3 max-w-lg mx-auto'  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <h1 className='text-sky-950 text-3xl text-center font-semibold my-7'>Sign In</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          
          <input type="email" placeholder='email' className='border p-3 rounded-lg' id="email"  onChange={handleChange}/>
          
          <input type="password" placeholder='password' className='border p-3 rounded-lg' id="password"  onChange={handleChange}/>
          
          <button disabled={loading} className='bg-sky-950 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          
           {/* sign with google */}
          <OAuth/>
        </form>

        <div className='flex gap-2 mt-5'>
          <p>Dont have an account?</p>
          <Link to="/sign-up">
            <span className='text-blue-700'>Sing Up</span>
          </Link>
        </div>
        {error &&  <ToastContainer />}
      </motion.div>
    </AnimatePresence>
  )
}
