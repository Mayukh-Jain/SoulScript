import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';

const FloatingImage = ({ url, index, setSelectedImg }) => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth out the motion like the video (Spring physics)
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  // 1. Vertical Parallax (Different speeds based on index)
  const speed = index % 2 === 0 ? [50, -50] : [100, -100];
  const yRaw = useTransform(scrollYProgress, [0, 1], speed);
  const y = useSpring(yRaw, springConfig);

  // 2. Subtle 3D Rotation (Tilts as it scrolls)
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 5 : -5]);
  const rotate = useSpring(rotateRaw, springConfig);

  // 3. Horizontal Drift
  const xRaw = useTransform(scrollYProgress, [0, 1], [index % 3 === 0 ? -20 : 20, index % 3 === 0 ? 20 : -20]);
  const x = useSpring(xRaw, springConfig);

  return (
    <motion.div
      ref={ref}
      style={{ y, x, rotateZ: rotate, perspective: 1000 }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.05, rotateZ: 0, z: 50, transition: { duration: 0.3 } }}
      onClick={() => setSelectedImg(url)}
      className="relative mb-12 cursor-zoom-in"
    >
      <div className="bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white/50 backdrop-blur-sm group">
        <div className="overflow-hidden rounded-[1rem] md:rounded-[2rem]">
          <motion.img
            src={url}
            alt={`Memory ${index + 1}`}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        
        {/* Floating Heart Indicator */}
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300">
          <span className="text-xs">✨</span>
        </div>
      </div>
    </motion.div>
  );
};

const RevealPage = () => {
  const [searchParams] = useSearchParams();
  const [giftData, setGiftData] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

  const targetClicks = 15;

  useEffect(() => {
    const data = searchParams.get('gift');
    if (data) {
      try {
        const decodedBase64 = decodeURIComponent(data);
        const binaryString = atob(decodedBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder('utf-8');
        let decodedText = decoder.decode(bytes);
        decodedText = decodedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
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

  useEffect(() => {
    if (isOpened && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#fce4ec');
      gradient.addColorStop(0.5, '#f06292');
      gradient.addColorStop(1, '#fce4ec');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 800; i++) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
      }
      ctx.globalAlpha = 1.0;
      ctx.font = 'bold 22px serif';
      ctx.fillStyle = '#880e4f';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH WITH LOVE ✨', canvas.width / 2, canvas.height / 2);
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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FF85A1', '#FFB1B1', '#FFFFFF'] });
  };

  if (!giftData) return null;

  const sectionLayout = "w-full min-h-screen flex flex-col items-center justify-center p-6 relative py-20 overflow-hidden";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFF5F5] font-serif scroll-smooth">
      
      {/* 1. LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImg} 
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MUSIC PLAYER */}
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

      {/* 3. RAINING HEARTS BACKGROUND */}
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
            className="h-screen w-full flex items-center justify-center z-50 bg-[#FFF5F5]"
          >
            <motion.div 
              onClick={handleOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-16 rounded-[4rem] shadow-2xl cursor-pointer text-center border-b-[12px] border-pink-100 max-w-sm w-full relative group"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-9xl mb-6 drop-shadow-lg">✉️</motion.div>
              <h1 className="text-2xl font-bold text-pink-600 italic tracking-tighter uppercase">For {giftData.partnerName}</h1>
              <p className="text-[10px] text-gray-300 mt-4 uppercase tracking-[0.3em]">Click to Open</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            <section className={sectionLayout}>
              <motion.h1 initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="text-6xl md:text-[10rem] text-pink-500 font-bold text-center tracking-tighter leading-none">
                Always <br/> Yours.
              </motion.h1>
              <div className="absolute bottom-10 animate-bounce text-pink-200 text-xs tracking-widest uppercase font-sans">Scroll to explore</div>
            </section>

            <section className={sectionLayout}>
              <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="max-w-3xl bg-white/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white shadow-2xl text-center">
                <p className="text-2xl md:text-4xl italic text-gray-800 leading-relaxed font-light whitespace-pre-wrap">"{giftData.loveNote}"</p>
              </motion.div>
            </section>

            <section className={sectionLayout}>
              <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                   <h2 className="text-3xl md:text-5xl text-pink-800 font-bold tracking-tighter">Our Journey</h2>
                   <div className="space-y-4">
                    {giftData.timeline.map((item, i) => (
                      <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-5 rounded-2xl border border-white flex justify-between shadow-sm items-center">
                        <span className="font-bold text-pink-500 text-sm md:text-lg">{item.date}</span>
                        <span className="italic text-gray-700 text-sm md:text-lg text-right ml-4">{item.text}</span>
                      </motion.div>
                    ))}
                   </div>
                </div>
                {giftData.imageUrl && (
                  <motion.div className="relative">
                    <motion.img 
                      initial={{ rotate: 3, opacity: 0 }} 
                      whileInView={{ rotate: 0, opacity: 1 }} 
                      src={giftData.imageUrl} 
                      className="rounded-[3rem] shadow-2xl border-[12px] border-white w-full object-cover aspect-[4/5]" 
                    />
                  </motion.div>
                )}
              </div>
            </section>

            <section className={sectionLayout}>
              <h2 className="text-xl md:text-2xl mb-8 text-pink-800 uppercase tracking-widest font-bold text-center">A Secret Note</h2>
              <div className="relative w-full max-w-xl aspect-video bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-4 md:border-8 border-white">
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 text-center bg-pink-50">
                  <p className="text-2xl md:text-3xl font-bold text-pink-600 italic whitespace-pre-wrap">"{giftData.finalMessage}"</p>
                </div>
                <canvas ref={canvasRef} width={600} height={350} onMouseMove={handleScratch} onTouchMove={handleScratch} className="absolute inset-0 cursor-crosshair touch-none" />
              </div>
            </section>

            <section className={sectionLayout}>
              <motion.div 
                onClick={handleLoveMeter}
                className={`w-full max-w-sm p-10 md:p-16 rounded-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-700 shadow-2xl ${unlocked ? 'bg-white scale-105' : 'bg-gradient-to-br from-pink-400 to-red-500 text-white'}`}
              >
                <h3 className="font-bold mb-6 tracking-widest text-center uppercase text-xs">{unlocked ? 'Gallery Unlocked' : 'Tap to Charge Love'}</h3>
                <div className="text-7xl md:text-9xl mb-8">{unlocked ? '🔓' : '❤️'}</div>
                <div className="w-full bg-black/10 h-4 rounded-full overflow-hidden">
                  <motion.div className="bg-white h-full" animate={{ width: `${(loveCount / targetClicks) * 100}%` }} />
                </div>
              </motion.div>
            </section>

            {/* DRIBBBLE STYLE GALLERY */}
            <AnimatePresence>
              {unlocked && (
                <section className="w-full min-h-screen py-32 px-4 md:px-12 bg-white/20">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-24">
                    <h2 className="text-4xl md:text-7xl mb-4 text-pink-800 font-black uppercase tracking-[0.3em]">Secret Vault</h2>
                    <div className="h-1 w-32 bg-pink-200 mx-auto rounded-full" />
                  </motion.div>

                  {/* 3-Column Masonry with Offset Columns for 3D Feel */}
                  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
                    {/* Column 1 */}
                    <div className="space-y-12 lg:pt-20">
                      {giftData.galleryUrls?.filter((_, i) => i % 3 === 0).map((url, i) => (
                        <FloatingImage key={i} url={url} index={i * 3} setSelectedImg={setSelectedImg} />
                      ))}
                    </div>
                    {/* Column 2 - Shifted slightly higher */}
                    <div className="space-y-12">
                      {giftData.galleryUrls?.filter((_, i) => i % 3 === 1).map((url, i) => (
                        <FloatingImage key={i} url={url} index={i * 3 + 1} setSelectedImg={setSelectedImg} />
                      ))}
                    </div>
                    {/* Column 3 - Shifted lowest */}
                    <div className="space-y-12 lg:pt-40">
                      {giftData.galleryUrls?.filter((_, i) => i % 3 === 2).map((url, i) => (
                        <FloatingImage key={i} url={url} index={i * 3 + 2} setSelectedImg={setSelectedImg} />
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </AnimatePresence>

            <section className={sectionLayout}>
              <motion.div whileInView={{ scale: [0.9, 1.1, 1] }} className="text-center">
                <p className="text-lg md:text-2xl text-gray-400 mb-2 font-light italic">Forever starts today,</p>
                <h2 className="text-6xl md:text-[10rem] text-pink-600 font-bold tracking-tighter leading-none">{giftData.senderName}</h2>
                <div className="text-6xl mt-12 opacity-30 animate-pulse">♾️</div>
              </motion.div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RevealPage;