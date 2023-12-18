import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from './Routes/user.route.js'
import authRouter from './Routes/auth.route.js'
import listingRouter  from './Routes/listing.route.js'
import cookieParser from "cookie-parser";
import path from 'path'


dotenv.config();

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('connected to Mongo DB!')
}).catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve();

const app = express();

app.use(cookieParser())

app.use(express.json())


app.listen(3000, ()=>{
    console.log('server is running on port 3000')
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)


app.use(express.static(path.join(__dirname, '/client-app/dist')));

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname,'client-app','dist','index.html'))
})


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