import React from 'react'
import { motion, AnimatePresence } from "framer-motion"


export default function MyListings() {
  return (
    <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            My Listings
        </motion.div>
    </AnimatePresence>
  )
}
