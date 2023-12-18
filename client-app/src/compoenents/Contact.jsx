import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({listing}) {

  const [landLoard,setLandLoard] = useState(null)
  const [message,setMessage] = useState("")

  const onChangeHandler = (e) =>{
    setMessage(e.target.value)
  }


  useEffect(()=>{
    const fetchLandLoad =  async ()  =>{
      try{
        const response = await fetch(`/api/user/${listing.userRef}`)
        const data = await response.json()
        if(data.success === false){
          console.log(data.message)
          return 
        }
  
        setLandLoard(data)
      }catch(err){
        console.log(err.message)
      }
    }

    fetchLandLoad();

  },[listing.userRef])
    
  return (
    <>
      {landLoard && (
        <div className='flex flex-col gap-2'>
          <p>Contact 
            <span className='font-semibold'>{landLoard.username}</span> for 
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea className='w-full border p-3 rounded-lg' 
              name="message" 
              id="message" 
              rows="2" 
              value={message} 
              onChange={onChangeHandler}>
            </textarea>
          
          <Link to={`mailto:${landLoard.email}?subject=Regarding ${listing.name}&body=${message}`} 
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
            Send Message
          </Link>
        </div>
      )}
    </>
  )
}
