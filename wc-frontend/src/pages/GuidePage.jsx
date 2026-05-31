// REQUIREMENT: Media Audio/Video (1pt) – <audio> elements
import React, { useRef, useState } from 'react';

export function GuidePage() {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.2);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.volume = audioVolume;
      audio.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((e) => {
        console.error("Audio playback blocked", e);
      });
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setAudioVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  return (
    <main className="page-fade-in flex-grow pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Background ambient audio player */}
      <audio
        ref={audioRef}
        src="/assets/audio/clash-of-clans-hq-audio.mp3"
        loop
        preload="auto"
      />

      {/* Guide Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-headings font-extrabold text-white tracking-wide uppercase">
          TUTORIALS & STRATEGY GUIDE
        </h1>
        <p className="text-sm text-amber-500 font-body font-semibold mt-1">
          Master the battlefield map & target planning
        </p>

        {/* Ambient music control banner */}
        <div className="mt-5 inline-flex items-center gap-4 bg-[#1a1d28] border border-white/5 px-4 py-2.5 rounded-xl shadow-md">
          <span className="text-[10px] font-bold text-slate-300 font-body uppercase tracking-wider">
            🎵 While you read the guide, here is some music
          </span>
          <button
            onClick={toggleAudio}
            className={`px-3 py-1 text-[10px] font-bold font-headings rounded uppercase transition-all ${
              isAudioPlaying
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isAudioPlaying ? 'Mute' : 'Play'}
          </button>
          
          {isAudioPlaying && (
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-body">Vol</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={audioVolume}
                onChange={handleVolumeChange}
                className="w-36 accent-amber-500 h-1 cursor-pointer bg-slate-700 rounded-full p-0 border-none outline-none focus:ring-0 focus:shadow-none focus:border-none focus:outline-none"
              />
            </div>
          )}
        </div>
      </header>

      {/* Strategy Breakdown Steps */}
      <div className="space-y-8">
        
        {/* Strategy Dashboard Card */}
        <section className="bg-[#1a1d28] border border-white/5 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-headings flex items-center gap-2">
            <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
            The Dashboard
          </h2>
          <p className="text-xs text-slate-400 font-body leading-relaxed">
            Welcome to the ultimate war intelligence center. Our system automatically extracts roster metrics, compiles parsed opponent armies, and organizes strategy blueprints to ensure full coordination on the battlefield.
          </p>
        </section>

        {/* 3 Steps */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-[#1a1d28] border border-white/5 rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-2xl font-headings font-extrabold text-amber-500">01</span>
              <h3 className="text-sm font-headings font-bold text-white uppercase mt-2">Intel Search</h3>
              <p className="text-xs text-slate-400 font-body leading-relaxed mt-2">
                Enter your clan's tag starting with <span className="text-amber-500 font-bold">#</span> on the main dashboard. We'll query real-time war schedules, rosters, and statistics directly.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1a1d28] border border-white/5 rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-2xl font-headings font-extrabold text-amber-500">02</span>
              <h3 className="text-sm font-headings font-bold text-white uppercase mt-2">Battlefield Intel</h3>
              <p className="text-xs text-slate-400 font-body leading-relaxed mt-2">
                Inspect the scattered Town Hall war battlefield. View enemy profiles, click bases to inspect defenses, and review their most-used troop compositions.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1a1d28] border border-white/5 rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-2xl font-headings font-extrabold text-amber-500">03</span>
              <h3 className="text-sm font-headings font-bold text-white uppercase mt-2">Target Planner</h3>
              <p className="text-xs text-slate-400 font-body leading-relaxed mt-2">
                Go to the Drag & Drop planner screen. Move your clan's members to specific enemy bases to distribute targets, and download the strategical blueprint as JSON.
              </p>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}

export default GuidePage;
