import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signin from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './compoenents/Header'
import PrivateRoute from './compoenents/privateRoute'




export default function App() {
  return (
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about" element={<About/>} />
      
      <Route element={<PrivateRoute/>} >
        <Route path="/profile" element={<Profile/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
 
}
