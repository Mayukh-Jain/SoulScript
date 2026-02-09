import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const CreatorPage = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    partnerName: '',
    loveNote: '',
    themeColor: '#FF85A1',
    imageUrl: '',
    musicUrl: '',
    finalMessage: '',
    timeline: [{ date: '', text: '' }],
    gallery: '' // Comma separated URLs
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const updateTimeline = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData({ ...formData, timeline: newTimeline });
  };

  const generateLink = () => {
    // Standardize YouTube link to embed format for background play
    let music = formData.musicUrl;
    if (music.includes('watch?v=')) {
      music = music.replace('watch?v=', 'embed/');
    } else if (music.includes('youtu.be/')) {
      music = `https://www.youtube.com/embed/${music.split('/').pop()}`;
    }

    const giftData = {
      ...formData,
      musicUrl: music,
      galleryUrls: formData.gallery.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    // Emoji-safe UTF-8 Encoding for the URL
    const bytes = new TextEncoder().encode(JSON.stringify(giftData));
    const base64Data = btoa(String.fromCharCode(...bytes));

    setGeneratedLink(`${window.location.origin}/reveal?gift=${base64Data}`);
    setIsCopied(false);
    confetti({ particleCount: 60, spread: 60, colors: [formData.themeColor, '#ffffff'] });
  };

  const galleryPreview = formData.gallery.split(',').map(url => url.trim()).filter(url => url.startsWith('http'));

  return (
    <div className="min-h-screen bg-[#FFF5F5] py-12 px-4 font-sans flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-pink-50">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-800 mb-2">SoulScript</h1>
          <p className="text-gray-400 text-sm italic">A Valentines Day Digital Gift</p>
          <p className="text-gray-400 text-sm italic">Build a full-screen interactive story for your person.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase text-pink-400 tracking-widest">1. The Basics</h3>
              <input type="text" placeholder="Your Name" className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-pink-200" onChange={e => setFormData({...formData, senderName: e.target.value})} />
              <input type="text" placeholder="Partner's Name" className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-pink-200" onChange={e => setFormData({...formData, partnerName: e.target.value})} />
              <textarea placeholder="Main Love Letter..." className="w-full p-3 bg-gray-50 rounded-xl h-24 outline-none resize-none" onChange={e => setFormData({...formData, loveNote: e.target.value})} />
            </section>

            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase text-pink-400 tracking-widest">2. Our Timeline</h3>
              {formData.timeline.map((item, i) => (
                <div key={i} className="flex gap-2 animate-in fade-in zoom-in duration-300">
                  <input type="text" placeholder="Date" className="w-1/3 p-2 bg-gray-50 rounded-lg text-xs outline-none" onChange={e => updateTimeline(i, 'date', e.target.value)} />
                  <input type="text" placeholder="Memory" className="w-2/3 p-2 bg-gray-50 rounded-lg text-xs outline-none" onChange={e => updateTimeline(i, 'text', e.target.value)} />
                </div>
              ))}
              <button onClick={() => setFormData({...formData, timeline: [...formData.timeline, {date:'', text:''}]})} className="text-[10px] font-bold text-pink-500 hover:text-pink-700 uppercase">+ Add Event</button>
            </section>

            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase text-pink-400 tracking-widest">3. Multimedia</h3>
              <p className="text-[10px] text-gray-400 mt-1 ml-2">
  💡 Need a link? Upload your photo to <a href="https://postimages.org" target="_blank" className="text-pink-400 underline">Postimages.org</a> and copy the "Direct Link".
</p>
              <input type="url" placeholder="Hero Image URL (jpg/png)" className="w-full p-3 bg-gray-50 rounded-xl outline-none" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <input type="text" placeholder="Gallery URLs (Comma separated)" className="w-full p-3 bg-gray-50 rounded-xl outline-none" onChange={e => setFormData({...formData, gallery: e.target.value})} />
              <input type="url" placeholder="YouTube Song Link" className="w-full p-3 bg-gray-50 rounded-xl outline-none" onChange={e => setFormData({...formData, musicUrl: e.target.value})} />
              <input type="text" placeholder="Secret Scratch-off Message" className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-pink-600" onChange={e => setFormData({...formData, finalMessage: e.target.value})} />
            </section>
          </div>

          {/* --- RIGHT COLUMN: LIVE PREVIEW --- */}
          <div className="bg-pink-50/30 rounded-[2.5rem] p-6 border border-pink-100 flex flex-col h-full">
            <h3 className="text-[10px] font-black uppercase text-pink-400 mb-4 tracking-widest text-center">Live Visual Preview</h3>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {/* Hero Preview */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Main Hero Image</p>
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Hero Preview" className="w-full h-40 object-cover rounded-2xl shadow-md border-4 border-white" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 italic text-xs">No hero image set</div>
                )}
              </div>

              {/* Gallery Preview */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Secret Vault Gallery ({galleryPreview.length})</p>
                <div className="grid grid-cols-3 gap-2">
                  {galleryPreview.length > 0 ? galleryPreview.map((url, idx) => (
                    <img key={idx} src={url} className="w-full h-16 object-cover rounded-lg border-2 border-white shadow-sm" alt="Gallery Preview" />
                  )) : (
                    <div className="col-span-3 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 italic text-[10px]">No gallery images</div>
                  )}
                </div>
              </div>

              {/* Theme Preview */}
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-pink-50 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Message Preview</p>
                <p className="text-sm italic text-gray-600 truncate">"{formData.loveNote || 'Your letter will appear here...'}"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button onClick={generateLink} className="w-full py-5 bg-pink-500 text-white font-bold rounded-[2rem] shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
            Create Magic Link <span className="text-xl">✨</span>
          </button>
        </div>

        {generatedLink && (
          <div className="mt-8 p-6 bg-gray-900 rounded-[2.5rem] text-white animate-in slide-in-from-bottom-5 duration-500">
            <p className="text-[10px] opacity-40 mb-2 uppercase tracking-[0.2em] font-bold">Your Unique Surprise Link:</p>
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl mb-4 border border-white/10">
              <p className="text-xs break-all font-mono text-pink-200 flex-1">{generatedLink}</p>
            </div>
            <button 
              onClick={() => {navigator.clipboard.writeText(generatedLink); setIsCopied(true); confetti();}} 
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isCopied ? 'bg-green-500' : 'bg-pink-500'}`}
            >
              {isCopied ? 'COPIED TO CLIPBOARD ✓' : 'COPY LINK TO SEND'}
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-gray-400 text-[10px] uppercase tracking-widest">
        Design with ❤️ for your special someone
      </footer>
    </div>
  );
};

export default CreatorPage;