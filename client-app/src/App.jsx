import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signin from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './compoenents/Header'
import PrivateRoute from './compoenents/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import MyListings from './Pages/MyListings'
import EditListing from './Pages/EditListing'
import Listing from './Pages/Listing'
import Search from './Pages/Search'




export default function App() {
  return (
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about" element={<About/>} />
      <Route path="/listing/:id" element={<Listing/>} />
      <Route path="/search?" element={<Search/>}/>
      
      <Route element={<PrivateRoute/>} >
        <Route path="/profile" element={<Profile/>} />
        <Route path='/createListing' element={<CreateListing />} />
        <Route path='/mylistings' element={<MyListings />} />
        <Route path='/update-listing/:id' element={<EditListing/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
 
}
