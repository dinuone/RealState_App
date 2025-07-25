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

export const searchListing = async (req, res, next) =>{

    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
    
        if (offer === undefined || offer === 'false') {
          offer = { $in: [false, true] };
        }
    
        let furnished = req.query.furnished;
    
        if (furnished === undefined || furnished === 'false') {
          furnished = { $in: [false, true] };
        }
    
        let parking = req.query.parking;
    
        if (parking === undefined || parking === 'false') {
          parking = { $in: [false, true] };
        }
    
        let type = req.query.type;
    
        if (type === undefined || type === 'all') {
          type = { $in: ['sale', 'rent'] };
        }
    
        const searchTerm = req.query.searchTerm || '';
    
        const sort = req.query.sort || 'createdAt';
    
        const order = req.query.order || 'desc';
    
        const listings = await Listing.find({
          name: { $regex: searchTerm, $options: 'i' },
          offer,
          furnished,
          parking,
          type,
        })
          .sort({ [sort]: order })
          .limit(limit)
          .skip(startIndex);
    
        return res.status(200).json(listings);
      
    } catch (error) {
        next(error);
    }
}