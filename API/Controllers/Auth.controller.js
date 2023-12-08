import User from "../Models/User.model.js";
import bycryptjs from 'bcryptjs'

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