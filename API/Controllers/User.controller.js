import Listing from "../Models/Listing.model.js"
import User from "../Models/User.model.js"
import { errorHandler } from "../Utils/error.js"
import bycryptjs from 'bcryptjs'
 


 export const UpdateUser  = async (req, res, next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can only update your own account'))
    }

    try{

        console.log(req.body)

        if(req.body.password){
            req.body.password = bycryptjs.hashSync(req.body.password,10)
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id,{
             $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avator: req.body.avator
             }
        }, {new:true})

        const {password, ...rest} = updateUser._doc

        res.status(200).json(rest)
 
        
    }catch(err){
        next(err)
    }
 }


 export const DeleteUser = async (req, res, next) => {
    
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can only delete your own account'))
    }

    try{

        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted')

    }catch(err){
        next(err)
    }
 }


 export const getUserListings = async (req, res, next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can only get own listings'))
    }

    try{
        const listings = await Listing.find({userRef:req.params.id})
        res.status(200).json(listings)
    }catch(err){
        next(err)
    }
  
 }

 export const getUser = async (req, res, next) => {
    try{

        const user = await User.findById(req.params.id)
        console.log(user)

        if(!user){
            return next(errorHandler(404,'User not found'))
        }
    
        const {password:pass, ...rest} = user._doc;
        res.status(200).json(rest)

    }catch(err){

        next(err)
    }
   
 }
   