import Listing from "../Models/Listing.model.js";
import { errorHandler } from "../Utils/error.js";


export const createListing = async (req, res, next) =>{
    try{

        const listing = await Listing.create(req.body);
        return res.status(200).json(listing)
       
    }catch(err){
        next(err);
    }
}

export const deleteListings = async (req, res, next) =>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,"you can only delete your own listings"))
    }

    try{

       await Listing.findByIdAndDelete(req.params.id)
       res.status(200).json("Listing has been deleted")
    }catch(err){
        next(err);
    }
}

export const updateListings = async (req, res, next) =>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,"you can only update your own listings"))
    }

    try{
        const updateListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(updateListing)

    }catch(err){
        next(err)
    }


}

export const getListing = async (req, res, next) =>{
  try{

    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }

    res.status(200).json(listing)
  }catch(err){
    next(err)
  }
}