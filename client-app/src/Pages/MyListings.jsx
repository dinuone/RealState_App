import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {  useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyListings() {

   const [error,setError] = useState(false)
   const {currentUser} = useSelector(state => state.user)
   const [listings, setListings] = useState([])
   const navigate = useNavigate();
   const [open, setOpen] = useState(false);
   const [houseId, setHouseId] = useState();
   const [success, setSuccess] = useState()

    const showListings = async () =>{
        try{
            setError(false)
            const res = await fetch(`api/user/listings/${currentUser._id}`)
            const data = await res.json()
            if(data.success === false){
                setError(true)
                return
            }

            setListings(data)
            
        }catch(err){
            setError(true)
        }
    }

    const handleEdit = (listing_id)=>{
        console.log(listing_id)
        navigate(`/update-listing/${listing_id}`)
    }

    const handleClickOpen = (id) => {
        setOpen(true);
        setHouseId(id)
    };
    
    const handleClose = () => {
        setOpen(false);
    };


    const handleDelete = async ()=>{
        try{
            const response = await fetch(`api/listing/delete/${houseId}`, {method: 'DELETE'})
            const data = await response.json();

            if(data.success === false){
                return
            }
            setSuccess(true)
            setOpen(false);
            notifySuccess("Listing has been deleted")
            setListings((prev) => prev.filter((listing)=> listing._id !== houseId))
        }catch(err){
            console.log(err)
        }
    }

    const notifySuccess = (msg) =>{
        toast.success(msg, {
          theme: "colored",
          position: toast.POSITION.TOP_CENTER
        });
      }
    

    useEffect(() => {
        showListings()
      }, []);

  return (
    <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >    
            <div className='max-w-lg mx-auto mt-3'>
              <h1 className='text-3xl font-semibold text-center my-7 text-gray-400'>My Listings</h1>
            </div>     

            <Container>
            <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, md: 12 }}>
            {   listings &&  listings.length> 0 &&   listings.map((listing,index)=>       
                    <Grid item  xs={2} sm={4} md={4} key={index}>
                    <Card raised={true} >
                        <CardMedia
                            sx={{ height: 200 }}
                            image={listing.imageUrls[0]}
                            title="house image"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {listing.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {listing.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="success"onClick={ () => handleEdit(listing._id) }>Update</Button>
                            <Button variant="outlined" size="small"  color="error" onClick={() => handleClickOpen(listing._id) }>Delete</Button>
                        </CardActions>
                    </Card> 
                </Grid>
                    
                ) 
                        
            }
              
             </Grid>
               
            </Container>


            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Do you want to delete this listing?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                   Please note that this action cannot be undo
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete} autoFocus>
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>

            {success && <ToastContainer/>}
        </motion.div>
    </AnimatePresence>
  )
}
