import React from 'react'
import { motion } from "framer-motion"
import { fadeIn, textVariant } from "../lib/motion"
import { useNavigate } from "react-router-dom"
import heroImage from '../assets/hero-image.png'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden">
      
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(1200px 600px at 0% 0%, rgba(216,180,254,0.35), transparent 60%),
            radial-gradient(800px 400px at 10% 20%, rgba(249,168,212,0.25), transparent 60%),
            linear-gradient(to bottom right, rgba(255,255,255,1), rgba(255,255,255,0.95))
          `
        }}
      />

      <section
        id="home"
        className="relative z-10 flex flex-col md:flex-row justify-between items-center 
        px-4 sm:px-6 lg:px-8 pt-44 pb-16 container mx-auto"
      >
        <div className="w-full md:w-1/2 space-y-8 flex flex-col items-start md:items-start">
          
          <motion.h1
            variants={textVariant(0.3)}
            initial="hidden"
            whileInView="show"
            className="text-8xl md:text-9xl font-extrabold leading-tight 
            bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
          >
            Healvia
          </motion.h1>

          <motion.h2
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            whileInView="show"
            className="text-3xl md:text-4xl font-bold leading-snug"
          >
            Health Guidance,
            <br />
            Made Simple
          </motion.h2>

          <motion.p
            variants={fadeIn('up', 0.4)}
            initial="hidden"
            whileInView="show"
            className="text-gray-600 text-lg md:text-xl max-w-xl"
          >
            Upload your diagnosis. Track your health. Get AI-powered guidance you can trust.
          </motion.p>

          <motion.div
            variants={fadeIn('up', 0.5)}
            initial="hidden"
            whileInView="show"
            className="flex gap-3 max-w-md"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/Register')}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl 
              hover:bg-blue-700 cursor-pointer transition-all 
              hover:shadow-lg hover:shadow-blue-100 flex items-center gap-2"
            >
              Sign Up →
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn('left', 0.5)}
          initial="hidden"
          whileInView="show"
          className="w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12"
        >
          <div className="relative">
            <img
              src={heroImage}
              alt="Team meeting"
              className="rounded-lg relative z-10 hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Hero