import User from "../Models/User.model.js"
import { errorHandler } from "../Utils/error.js"
import bycryptjs from 'bcryptjs'
 
 export const test = (req, res) => {
    res.json({
        message:"hello world test"
    })
 }

 export const UpdateUser  = async (req, res, next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can only update your account'))
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
   