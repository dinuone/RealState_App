import { Box, CircularProgress, Container } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams} from "react-router-dom"
import {Swiper, SwiperSlide} from 'swiper/react'
import { Navigation } from "swiper/modules"
import 'swiper/css';
import 'swiper/css/navigation';

export default function Listing() {


    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    console.log(listing)

    useEffect(()=>{

        const fetchingData = async ()  =>{
            setLoading(true)
            const res = await fetch(`/api/listing/getListing/${params.id}`)
            const data = await res.json()
            if(data.status === false){
                console.log(data.message)
                setLoading(false)
                return 
            }

            setListing(data)
            setLoading(false)
        }

        fetchingData()

    },[])

  return (
    <main>
        {loading && <p className="text-center my-7">Loading....</p> }

        {listing &&
            <div>
                <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                    {listing.imageUrls.map((url, index) => (    
                            <SwiperSlide key={index}>
                                <div className="h-[500px]" style={{background: `url(${url}) center no-repeat`, backgroundSize:'cover'}}></div>
                            </SwiperSlide>
                    ))}
                </Swiper>
            </div>
         }
        
    </main>

    
  )
}
