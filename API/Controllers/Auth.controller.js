import mongoose from "mongoose";
import User from "../Models/User.model.js";
import bycryptjs from 'bcryptjs'
import { errorHandler } from "../Utils/error.js";
import jwt from 'jsonwebtoken';

export const Signup = async (req, res, next) => {

  const {username, email, password} = req.body;
  const hashPassword = bycryptjs.hashSync(password,10);
  const newUser = new User({username,email,password:hashPassword});
 
  try{
    await newUser.save();
    res.status(200).json({message:"User Created successfully"})
  
  }catch(err){
    next(err);
  }

 
}

export const SignIn = async (req, res, next) => {
  const {email, password} = req.body;
  try{

    const validUser = await User.findOne({email})
    if(!validUser) return next(errorHandler(404, "User not found"))

    const validPassword = bycryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401,"Wrong Credentials!"))

    const token = jwt.sign({id:validUser._id}, process.env.JWT_SECERET_KEY)

    //remove password from response
    const {password: pass, ...rest } = validUser._doc;

    res.cookie('access_token',token,{httpOnly:true})
      .status(200)
      .json(rest)

  }catch{
    next(err);
  }
}

export const GoogleAuth = async (req, res, next) => {
  try{

    const user = await User.findOne({email:req.body.email})

    if(user){ //if user is already existing

      const token = jwt.sign({id:user._id}, process.env.JWT_SECERET_KEY)
      const {password: pass, ...rest } = user._doc; 
      
      res.cookie('access_token',token,{httpOnly:true})
      .status(200)
      .json(rest)
    
    }else{

        const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8) 
        const hasedPassword = bycryptjs.compareSync(generatedPassword, validUser.password);

        const newusername = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8)
        
        const newUser = new User({
          username: newusername,
          email:req.body.email,
          password:hasedPassword,
          avator:req.body.photo
        })

        await newUser.save()

        const token = wt.sign({id:newUser._id}, process.env.JWT_SECERET_KEY)
        const {password: pass, ...rest } = newUser._doc; 

        res.cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest)
    }

  }catch(err){
    next(err);
  }
}