import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProposalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Tracking mouse for the subtle glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const yesButtonSize = noCount * 20 + 18;
  
  const phrases = [
    "No", "Are you sure?", "Really sure??", "Think again!", 
    "Last chance!", "Surely not?", "You might regret this!", 
    "Give it another thought!", "Don't be so cold!", "Change of heart?",
    "Wait, really?", "I'm gonna cry...", "You're breaking my heart", "Plsssss", "No :("
  ];

  const handleYes = () => {
    setYesPressed(true);
    setTimeout(() => {
      navigate(`/story${location.search}`);
    }, 2500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#FFF5F5] overflow-hidden font-serif">
      
      {/* 1. INTERACTIVE AMBIENT GLOW */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 182, 193, 0.4) 0%, transparent 25%)`
        }}
      />

      {/* 2. FLOATING ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw` }}
            animate={{ y: "-10vh" }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
            className="absolute text-pink-300"
            style={{ fontSize: `${Math.random() * 20 + 10}px` }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!yesPressed ? (
          <motion.div 
            key="proposal-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="z-10 bg-white/60 backdrop-blur-xl p-8 md:p-16 rounded-[4rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white/40 text-center max-w-lg w-full mx-4"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative inline-block mb-8"
            >
              <img 
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWdtcmZid3Z6em9oZ3R3Ym1iY21oYmR0bm9oZ3R3Ym1iY21oYmR0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif" 
                className="h-40 md:h-48 drop-shadow-2xl"
                alt="Bears"
              />
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-black text-pink-600 mb-10 tracking-tighter leading-tight">
              Will you be my <br/> Valentine? 🌹
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <motion.button 
                onClick={handleYes}
                style={{ fontSize: yesButtonSize }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-3xl shadow-xl transition-colors whitespace-nowrap order-2 md:order-1"
              >
                Yes
              </motion.button>
              
              {noCount < 15 && (
                <motion.button 
                  onClick={() => setNoCount(noCount + 1)}
                  whileHover={{ rotate: [0, -2, 2, 0] }}
                  className="bg-red-400/10 hover:bg-red-500 hover:text-white text-red-500 font-bold py-3 px-8 rounded-2xl border-2 border-red-200 transition-all order-1 md:order-2"
                  style={{ transform: `scale(${Math.max(1 - noCount * 0.08, 0.5)})` }}
                >
                  {phrases[Math.min(noCount, phrases.length - 1)]}
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
        // Replace the "celebration" motion.div block in your ProposalPage.jsx
        <motion.div 
        key="celebration"
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="z-10 text-center"
        >
        <div className="bg-white/80 backdrop-blur-md p-12 rounded-[5rem] shadow-2xl border-4 border-pink-200">
            <div className="relative h-56 mb-6 mx-auto flex items-center justify-center">
            {/* Fallback heart while image loads */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 text-6xl animate-pulse">
                ❤️
            </div>
            <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Zic3R4bmh4Z3R3Ym1iY21oYmR0bm9oZ3R3Ym1iY21oYmR0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/MDJ9IbZY3ZbeFjPaB8/giphy.gif" 
                className="h-full w-auto object-contain" 
                alt="Happy celebration"
                onError={(e) => e.target.src = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Zic3R4bmh4Z3R3Ym1iY21oYmR0bm9oZ3R3Ym1iY21oYmR0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/MDJ9IbZY3ZbeFjPaB8/giphy.gif"}
            />
            </div>
            <h2 className="text-5xl font-black text-pink-600 italic tracking-tighter mb-4">Hehe, I knew it! ❤️</h2>
            <div className="flex items-center justify-center gap-2">
            <motion.div 
                animate={{ scale: [1, 1.5, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 bg-pink-500 rounded-full"
            />
            <p className="text-pink-400 font-bold tracking-widest uppercase text-[10px]">Unlocking your memories</p>
            </div>
        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalPage;