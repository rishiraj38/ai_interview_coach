"use client";

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'

const Authlayout = ({children}:{children:ReactNode}) => {
  return (
    <div className="auth-layout relative overflow-hidden bg-dark-100 min-h-screen flex items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-200/20 via-dark-100 to-dark-100 opacity-50 pointer-events-none" />

      {/* Flying Plane Animation */}
      <motion.div
        initial={{ x: "-100vw", y: "50vh", rotate: 0, scale: 0.5 }}
        animate={{ 
            x: ["-100vw", "0vw", "100vw"], 
            y: ["50vh", "20vh", "-20vh"],
            rotate: [0, -10, -20],
            scale: [0.5, 1.2, 1.5]
        }}
        transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            times: [0, 0.6, 1]
        }}
        className="fixed z-50 text-primary-200 pointer-events-none"
      >
        <Plane className="w-32 h-32 fill-current opacity-80" />
      </motion.div>

      {/* Content Fade In after Plane flies by */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary-200/20 border border-primary-200/30 flex items-center justify-center text-primary-200 mb-4 backdrop-blur-sm">
                <Plane className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Aero Prep</h1>
            <p className="text-light-400 mt-2">Flight Simulator for Technical Interviews</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export default Authlayout
