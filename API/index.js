import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from './Routes/user.route.js'
import authRouter from './Routes/auth.route.js'
import listingRouter  from './Routes/listing.route.js'
import cookieParser from "cookie-parser";


dotenv.config();

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('connected to Mongo DB!')
}).catch((err)=>{
    console.log(err)
})

const app = express();

app.use(cookieParser())

app.use(express.json())


app.listen(3000, ()=>{
    console.log('server is running on port 3000')
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)


//middleare 
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})