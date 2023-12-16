import React from 'react'
import { motion, AnimatePresence } from "framer-motion"


export default function MyListings() {
  return (
    <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7 text-gray-400'>My Listings</h1>
            <div className='flex flex-col gap-4'>
                <div className='text-2xl font-semibold border border-gray-600 rounded-lg shadow p-3 hover:shadow-xl disabled:shadow-lg bg-white'>
                    <div className='flex justify-between items-center gap-4'>
                         <img src="https://pinoyhousedesigns.com/wp-content/uploads/2017/07/IMAGE-1-1.png" alt="" className='w-full sm:w-60 h-50 rounded-lg object-contain' />
                         <p className='text-slate-500 font-semibold flex-row hover:underline truncate'>Name</p>
                         <button className='bg-red-600 text-white rounded-lg hover:opacity-95 disabled:opacity-80 p-1 flex-row'>Edit</button>
                    </div>
                </div>  
                <div className='text-2xl font-semibold border border-gray-600 rounded-lg shadow p-3 hover:shadow-xl disabled:shadow-lg bg-white'>
                    <div className='flex justify-between items-center gap-4'>
                         <img src="https://pinoyhousedesigns.com/wp-content/uploads/2017/07/IMAGE-1-1.png" alt="" className='w-full sm:w-60 h-50 rounded-lg object-contain' />
                         <p className='text-slate-500 font-semibold flex-row hover:underline truncate'>Name</p>
                         <button className='bg-red-600 text-white rounded-lg hover:opacity-95 disabled:opacity-80 p-1 flex-row'>Edit</button>
                    </div>
                </div>   
            </div>
        </motion.div>
    </AnimatePresence>
  )
}
