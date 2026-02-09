import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const RevealPage = () => {
  const [searchParams] = useSearchParams();
  const [giftData, setGiftData] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

  const targetClicks = 15;

  useEffect(() => {
    const data = searchParams.get('gift');
    if (data) {
      try {
        // 1. Decode Base64 to a string of raw bytes
        const binaryString = atob(data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 2. Decode the bytes as UTF-8 text
        const decodedData = new TextDecoder().decode(bytes);
        
        // 3. Parse the JSON
        setGiftData(JSON.parse(decodedData));
      } catch (e) {
        console.error("Link error:", e);
        // Optional: Redirect to home or show a user-friendly error
      }
    }
  }, [searchParams]);

  // Handle Scratch-off initialization
  useEffect(() => {
    if (isOpened && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#CBD5E1'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 20px serif'; ctx.fillStyle = '#64748B'; ctx.textAlign = 'center';
      ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
    }
  }, [isOpened]);

  const handleScratch = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();
  };

  const handleLoveMeter = () => {
    if (unlocked) return;
    setLoveCount(p => p + 1);
    if (navigator.vibrate) navigator.vibrate(10);
    if (loveCount + 1 >= targetClicks) {
      setUnlocked(true);
      confetti({ particleCount: 150, spread: 70 });
    }
  };

  const toggleMusic = () => {
    const command = isPlaying ? 'pauseVideo' : 'playVideo';
    playerRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
    setIsPlaying(!isPlaying);
  };

  const getYTId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!giftData) return null;

  const slide = "h-screen w-full flex flex-col items-center justify-center snap-start p-6 relative shrink-0";

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar bg-[#FFF5F5] font-serif">
      
      {/* 1. PERSISTENT AUDIO PLAYER */}
      {giftData.musicUrl && isOpened && (
        <>
          <iframe
            ref={playerRef}
            className="hidden"
            src={`https://www.youtube.com/embed/${getYTId(giftData.musicUrl)}?enablejsapi=1&autoplay=1&controls=0`}
            allow="autoplay"
          ></iframe>
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-[100] bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl border border-pink-100"
          >
            {isPlaying ? '🎵' : '🔇'}
          </motion.button>
        </>
      )}

      {/* 2. RAINING HEARTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div key={i} initial={{ y: -100, x: `${Math.random() * 100}vw` }} animate={{ y: '110vh' }} transition={{ duration: Math.random() * 5 + 7, repeat: Infinity, ease: "linear" }} className="absolute text-pink-200/40 text-3xl">❤️</motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!isOpened ? (
          <motion.div exit={{ opacity: 0, scale: 0.9 }} className="h-screen w-full flex items-center justify-center snap-start z-50 bg-[#FFF5F5]">
            <motion.div onClick={() => setIsOpened(true)} whileHover={{ scale: 1.05 }} className="bg-white p-16 rounded-[4rem] shadow-2xl cursor-pointer text-center border-b-[12px] border-pink-100 max-w-sm w-full">
              <div className="text-9xl mb-6">✉️</div>
              <h1 className="text-2xl font-bold text-pink-600 italic tracking-tighter uppercase">For {giftData.partnerName}</h1>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* SECTION 1: HERO */}
            <section className={slide}>
              <motion.h1 initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="text-7xl md:text-[10rem] text-pink-500 font-bold text-center tracking-tighter leading-none">
                Always <br/> Yours.
              </motion.h1>
              <div className="absolute bottom-10 animate-bounce text-pink-200 text-xs tracking-widest uppercase font-sans">Scroll to explore</div>
            </section>

            {/* SECTION 2: THE NOTE */}
            <section className={slide}>
              <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="max-w-3xl bg-white/40 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white shadow-2xl text-center">
                <p className="text-3xl md:text-4xl italic text-gray-800 leading-relaxed font-light">"{giftData.loveNote}"</p>
              </motion.div>
            </section>

            {/* SECTION 3: BENTO TIMELINE */}
            <section className={slide}>
              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                   <h2 className="text-4xl text-pink-800 font-bold tracking-tighter">Our Journey</h2>
                   {giftData.timeline.map((item, i) => (
                    <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} className="bg-white/50 p-6 rounded-3xl border border-white flex justify-between">
                      <span className="font-bold text-pink-400">{item.date}</span>
                      <span className="italic text-gray-600">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                {giftData.imageUrl && (
                  <motion.img initial={{ rotate: 3, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} src={giftData.imageUrl} className="rounded-[3rem] shadow-2xl border-[12px] border-white" />
                )}
              </div>
            </section>

            {/* SECTION 4: THE SCRATCH REVEAL */}
            <section className={slide}>
              <h2 className="text-2xl mb-8 text-pink-800 uppercase tracking-widest font-bold">A Secret Note</h2>
              <div className="relative w-full max-w-xl aspect-video bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-pink-50">
                  <p className="text-3xl font-bold text-pink-600 italic">"{giftData.finalMessage}"</p>
                </div>
                <canvas ref={canvasRef} width={600} height={350} onMouseMove={handleScratch} onTouchMove={handleScratch} className="absolute inset-0 cursor-crosshair touch-none" />
              </div>
            </section>

            {/* SECTION 5: LOVE METER */}
            <section className={slide}>
              <motion.div 
                onClick={handleLoveMeter}
                className={`w-full max-w-sm p-12 rounded-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-700 shadow-2xl ${unlocked ? 'bg-white scale-105' : 'bg-gradient-to-br from-pink-400 to-red-500 text-white'}`}
              >
                <h3 className="font-bold mb-6 tracking-widest text-center uppercase text-xs">{unlocked ? 'Gallery Unlocked' : 'Tap to Charge Love'}</h3>
                <div className="text-8xl mb-6">{unlocked ? '🔓' : '❤️'}</div>
                <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden">
                  <motion.div className="bg-white h-full" animate={{ width: `${(loveCount / targetClicks) * 100}%` }} />
                </div>
              </motion.div>
            </section>

            {/* SECTION 6: SECRET VAULT */}
            <AnimatePresence>
              {unlocked && (
                <section className={slide}>
                  <h2 className="text-4xl mb-10 text-pink-800 font-bold uppercase tracking-widest">Secret Vault</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
                    {giftData.galleryUrls?.map((url, i) => (
                      <motion.img key={i} src={url} initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} className="rounded-3xl border-4 border-white shadow-lg h-48 w-full object-cover shadow-pink-100" />
                    ))}
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* SECTION 7: SIGN OFF */}
            <section className={slide}>
              <motion.div whileInView={{ scale: [0.9, 1.1, 1] }} className="text-center">
                <p className="text-xl text-gray-400 mb-2 font-light italic">Forever starts today,</p>
                <h2 className="text-7xl md:text-9xl text-pink-600 font-bold tracking-tighter">{giftData.senderName}</h2>
                <div className="text-5xl mt-12 opacity-30 animate-pulse">♾️</div>
              </motion.div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RevealPage;