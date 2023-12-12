import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import {app} from '../firebase'
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'

export default function OAuth() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () =>{
    try{
        
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const response = await signInWithPopup(auth,provider)

      const res = await fetch('api/auth/google',{
        method: 'POST',
        headers:{
          'content-type': 'application/json'
        },
        body: JSON.stringify({name: response.user.displayName, email:response.user.email, photo:response.user.photoURL}),
      })
      
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/') //navigate to home page


    }catch(err){
        console.log('could not sing in google',err);
    }
  }

  return (
    <button type="button" 
    onClick={handleGoogleClick}
    className='bg-slate-900 text-white rounded-lg p-3 uppercase hover:opacity-95 shadow'>Continue With Google</button>
  )
}
