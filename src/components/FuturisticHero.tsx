"use client";
import { motion } from "framer-motion";

export default function FuturisticHero({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden futuristic-bg">
      <svg className="absolute inset-0 w-full h-full z-0" aria-hidden fill="none" xmlns="http://www.w3.org/2000/svg">
        <radialGradient id="bgGradient" cx="50%" cy="45%" r="80%">
          <stop stopColor="#00dcff" offset="0%"/>
          <stop stopColor="#0851e6" offset="65%"/>
          <stop stopColor="#040226" offset="100%"/>
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
      </svg>
      {/* Floating particles */}
      {[...Array(18)].map((_,i)=>(
        <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-cyan-300/60 shadow-lg"
          initial={{
            x: Math.random()*1500-750,
            y: Math.random()*600-300,
            scale: Math.random()*1+0.5,
            opacity: 0.25+Math.random()*0.4,
          }}
          animate={{
            y: [null, (Math.random()*900-450)],
            opacity: [null,0.13+Math.random()*0.6],
          }}
          transition={{
            duration:3+Math.random()*7,
            repeat:Infinity,
            yoyo:true,
            delay:Math.random()*2
          }}
        />
      ))}
      <motion.div initial={{opacity:0, y:70}} animate={{opacity:1, y:0}} transition={{duration:.9}}
        className="relative z-10 flex flex-col items-center mt-14 md:mt-28"
      >
        <div className="backdrop-blur-[6px] px-10 md:px-20 py-9 border-[2.5px] border-cyan-400/50 shadow-2xl rounded-3xl neon-glow glass-lg flex flex-col items-center w-full max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-cyan-200 drop-shadow-lg tracking-tighter mb-1 text-center" style={{textShadow:"0 0 15px #27f1fe, 0 1px 40px #23dced"}}>Crack NCERT</h1>
          <p className="text-cyan-100/90 font-bold text-md md:text-lg text-center mb-2 animate-pulse" style={{textShadow:"0 0 7px #86ecfe, 0 0 18px #18e2f8"}}>Futuristic NCERT chapter MCQ practice, powered by AI</p>
          <div className="w-full mt-3">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
