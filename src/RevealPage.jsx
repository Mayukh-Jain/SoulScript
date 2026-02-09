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
      // 1. Decode URL encoding first, then Base64
      const decodedBase64 = decodeURIComponent(data);
      const binaryString = atob(decodedBase64);
      
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 2. Use TextDecoder with 'utf-8' explicitly
      const decoder = new TextDecoder('utf-8');
      let decodedText = decoder.decode(bytes);

      // 3. Scrub ANY non-printable characters or "garbage" bytes
      // This removes the  and control characters
      decodedText = decodedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      
      // 4. Final safety check: if it doesn't look like JSON, don't parse it
      if (decodedText.trim().startsWith('{')) {
        setGiftData(JSON.parse(decodedText));
      } else {
        throw new Error("Invalid JSON structure");
      }
    } catch (e) {
      console.error("Link error:", e);
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
    if (!playerRef.current) return;
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
  const handleOpen = () => {
    setIsOpened(true);

    // 1. Center burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF85A1', '#FFB1B1', '#FFFFFF']
    });

    // 2. Left side burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF85A1', '#FFFFFF']
    });

    // 3. Right side burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF85A1', '#FFFFFF']
    });
  };
  if (!giftData) return null;

  const slide = "h-screen w-full flex flex-col items-center justify-center snap-start p-6 relative shrink-0 overflow-hidden";

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
            className="fixed bottom-6 right-6 z-[100] bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl border border-pink-100 focus:outline-none"
          >
            {isPlaying ? '🎵' : '🔇'}
          </motion.button>
        </>
      )}

      {/* 2. RAINING HEARTS BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div key={i} initial={{ y: -100, x: `${Math.random() * 100}vw` }} animate={{ y: '110vh' }} transition={{ duration: Math.random() * 5 + 7, repeat: Infinity, ease: "linear" }} className="absolute text-pink-200/40 text-3xl">❤️</motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!isOpened ? (
          <motion.div 
            key="envelope-screen"
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }} 
            className="h-screen w-full flex items-center justify-center snap-start z-50 bg-[#FFF5F5]"
          >
            <motion.div 
              onClick={handleOpen} // Triggers the triple confetti burst
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-16 rounded-[4rem] shadow-2xl cursor-pointer text-center border-b-[12px] border-pink-100 max-w-sm w-full relative group"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl mb-6 drop-shadow-lg"
              >
                ✉️
              </motion.div>
              <h1 className="text-2xl font-bold text-pink-600 italic tracking-tighter uppercase">
                For {giftData.partnerName}
              </h1>
              <p className="text-[10px] text-gray-300 mt-4 uppercase tracking-[0.3em]">Click to Open</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            <section className={slide}>
              <motion.h1 initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="text-6xl md:text-[10rem] text-pink-500 font-bold text-center tracking-tighter leading-none">
                Always <br/> Yours.
              </motion.h1>
              <div className="absolute bottom-10 animate-bounce text-pink-200 text-xs tracking-widest uppercase font-sans">Scroll to explore</div>
            </section>

            <section className={slide}>
              <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="max-w-3xl bg-white/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white shadow-2xl text-center">
                <p className="text-2xl md:text-4xl italic text-gray-800 leading-relaxed font-light whitespace-pre-wrap">"{giftData.loveNote}"</p>
              </motion.div>
            </section>

            <section className={slide}>
              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 md:space-y-6">
                   <h2 className="text-3xl md:text-4xl text-pink-800 font-bold tracking-tighter">Our Journey</h2>
                   <div className="space-y-3">
                    {giftData.timeline.map((item, i) => (
                      <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} className="bg-white/50 p-4 rounded-2xl border border-white flex justify-between shadow-sm">
                        <span className="font-bold text-pink-400 text-sm md:text-base">{item.date}</span>
                        <span className="italic text-gray-600 text-sm md:text-base">{item.text}</span>
                      </motion.div>
                    ))}
                   </div>
                </div>
                {giftData.imageUrl && (
                  <motion.img 
                    initial={{ rotate: 3, opacity: 0 }} 
                    whileInView={{ rotate: 0, opacity: 1 }} 
                    src={giftData.imageUrl} 
                    className="rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-[8px] md:border-[12px] border-white max-h-[40vh] md:max-h-full object-cover" 
                  />
                )}
              </div>
            </section>

            <section className={slide}>
              <h2 className="text-xl md:text-2xl mb-8 text-pink-800 uppercase tracking-widest font-bold">A Secret Note</h2>
              <div className="relative w-full max-w-xl aspect-video bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-4 md:border-8 border-white">
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 text-center bg-pink-50">
                  <p className="text-2xl md:text-3xl font-bold text-pink-600 italic whitespace-pre-wrap">"{giftData.finalMessage}"</p>
                </div>
                <canvas 
                  ref={canvasRef} 
                  width={600} 
                  height={350} 
                  onMouseMove={handleScratch} 
                  onTouchMove={handleScratch} 
                  className="absolute inset-0 cursor-crosshair touch-none" 
                />
              </div>
            </section>

            <section className={slide}>
              <motion.div 
                onClick={handleLoveMeter}
                className={`w-full max-w-sm p-10 md:p-12 rounded-[3.5rem] md:rounded-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-700 shadow-2xl ${unlocked ? 'bg-white scale-105' : 'bg-gradient-to-br from-pink-400 to-red-500 text-white'}`}
              >
                <h3 className="font-bold mb-6 tracking-widest text-center uppercase text-xs">{unlocked ? 'Gallery Unlocked' : 'Tap to Charge Love'}</h3>
                <div className="text-7xl md:text-8xl mb-6">{unlocked ? '🔓' : '❤️'}</div>
                <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden">
                  <motion.div className="bg-white h-full" animate={{ width: `${(loveCount / targetClicks) * 100}%` }} />
                </div>
              </motion.div>
            </section>

            <AnimatePresence>
              {unlocked && (
                <section className={slide}>
                  <h2 className="text-3xl md:text-4xl mb-10 text-pink-800 font-bold uppercase tracking-widest">Secret Vault</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl overflow-y-auto px-2">
                    {giftData.galleryUrls?.map((url, i) => (
                      <motion.img 
                        key={i} 
                        src={url} 
                        initial={{ scale: 0.5, opacity: 0 }} 
                        whileInView={{ scale: 1, opacity: 1 }} 
                        transition={{ delay: i * 0.1 }} 
                        className="rounded-2xl md:rounded-3xl border-2 md:border-4 border-white shadow-lg h-32 md:h-48 w-full object-cover shadow-pink-100" 
                      />
                    ))}
                  </div>
                </section>
              )}
            </AnimatePresence>

            <section className={slide}>
              <motion.div whileInView={{ scale: [0.9, 1.1, 1] }} className="text-center">
                <p className="text-lg md:text-xl text-gray-400 mb-2 font-light italic">Forever starts today,</p>
                <h2 className="text-6xl md:text-9xl text-pink-600 font-bold tracking-tighter">{giftData.senderName}</h2>
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