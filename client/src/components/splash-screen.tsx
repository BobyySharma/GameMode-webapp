import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    // Step 1: Show logo
    const timer1 = setTimeout(() => setStep(1), 1000);
    
    // Step 2: Show tagline
    const timer2 = setTimeout(() => setStep(2), 2000);
    
    // Complete the animation
    const timer3 = setTimeout(() => {
      setStep(3);
      setTimeout(onComplete, 500); // Give time for exit animation
    }, 3200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        >
          <div className="relative z-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-700 via-red-500 to-red-800 blur-lg opacity-40"></div>
                <div className="relative px-8 py-6 border-2 border-red-500/30 rounded-xl bg-black shadow-xl">
                  <h1 className="text-5xl font-['Orbitron'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                    GAMEMODE
                  </h1>
                </div>
              </div>
            </motion.div>
            
            {/* Tagline */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-xl text-gray-300">
                    Level Up Your Productivity
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
          </div>
          
          {/* Loading bar */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-40">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-700"
                initial={{ width: "0%" }}
                animate={{ width: `${(step + 1) * 33}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}