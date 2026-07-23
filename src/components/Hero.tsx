import React from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  setCurrentTab: (tab: 'home' | 'menu' | 'about' | 'book') => void;
}

export default function Hero({ setCurrentTab }: HeroProps) {
  return (
    <section className="relative h-[55vh] min-h-[380px] sm:min-h-[440px] sm:h-[60vh] w-full overflow-hidden flex items-center justify-center bg-primary-950">
      {/* Background Image with Slow Motion Zoom */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          className="w-full h-full bg-cover bg-center opacity-85"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920')",
          }}
        />
        {/* Dark overlay gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/40 to-primary-950/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mt-6 sm:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-3"
        >
          <span className="text-[9px] sm:text-xs font-sans font-bold tracking-[0.3em] text-gold-400 uppercase block">
            SO DHOWEYNTIINII WAA NOO FARXAD
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-[1.15] mb-4"
        >
          Kusoo dhawaada <br />
          Baraa Restaurant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xs sm:text-sm text-gray-300/90 max-w-xl mx-auto font-sans leading-relaxed mb-6"
        >
          Khibrad cunto oo heer sare ah, dhadhan dhab ah iyo jawi raaxo leh oo loogu talagalay dadka jecel tayada sare.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-row gap-3 justify-center items-center"
        >
          <button
            onClick={() => setCurrentTab('book')}
            className="bg-gold-300 hover:bg-gold-400 text-primary-950 font-sans font-bold text-[10px] sm:text-xs tracking-widest px-5 py-3 rounded-none transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            DALBO MIIS
          </button>
          
          <button
            onClick={() => setCurrentTab('menu')}
            className="bg-transparent hover:bg-white/5 text-white font-sans font-bold text-[10px] sm:text-xs tracking-widest px-5 py-3 rounded-none border border-white/20 hover:border-white/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            FIIRI MENYADA
          </button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 text-white">
        <span className="text-[7.5px] font-sans tracking-[0.3em] uppercase">HOOS U DAG</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
