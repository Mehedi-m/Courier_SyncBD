'use client';

import { useState, useRef } from 'react';
import { Truck, Sparkles, MapPin, CheckCircle2, ShieldCheck, Box } from 'lucide-react';

export default function ThreeDParcel() {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 12, y: -18 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation angles
    const rotX = -(y / (rect.height / 2)) * 22;
    const rotY = (x / (rect.width / 2)) * 26;

    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 10, y: -16 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[420px] h-[380px] sm:h-[420px] mx-auto perspective-1000 flex items-center justify-center select-none cursor-pointer"
    >
      {/* Ambient Lighting Glow Behind 3D Object */}
      <div 
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-sky-400/20 blur-3xl pointer-events-none transition-transform duration-500"
        style={{
          transform: `scale(${isHovered ? 1.25 : 1})`,
        }}
      />

      {/* 3D Rotational Canvas Card */}
      <div
        className="relative w-72 sm:w-80 h-80 sm:h-88 preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Main Parcel Body: Premium Kraft Package */}
        <div 
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-100 via-amber-200/90 to-amber-300 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-300/80 dark:border-indigo-500/40 shadow-2xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300"
          style={{
            boxShadow: isHovered 
              ? '0 30px 60px -15px rgba(79, 70, 229, 0.3), 0 0 25px rgba(99, 102, 241, 0.2)' 
              : '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Shipping Packaging Tape across the Box */}
          <div className="absolute -left-10 -right-10 top-1/2 -translate-y-1/2 h-10 bg-amber-400/30 dark:bg-indigo-900/30 border-y border-amber-500/20 dark:border-indigo-500/30 -rotate-6 pointer-events-none flex items-center justify-around overflow-hidden">
            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-900/40 dark:text-indigo-300/40">FRAGILE • PRIORITY DISPATCH</span>
            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-900/40 dark:text-indigo-300/40">BANGLADESH LOGISTICS</span>
          </div>

          {/* Top Row: Courier Priority Badges */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-md">
              <Truck size={13} />
              <span>Steadfast Express</span>
            </div>
            <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
              COD ৳1,850
            </span>
          </div>

          {/* Center: Shipping Label with Real Barcode & Address */}
          <div className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2.5 z-10">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <div className="flex items-center gap-1 text-[11px] font-black text-slate-900 dark:text-white">
                <span>CourierSync</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">BD</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                SF-884920
              </span>
            </div>

            <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
              <p className="font-bold text-slate-800 dark:text-slate-100">To: Rahim Uddin (01712-345678)</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">House 12, Road 5, Mirpur 10, Dhaka</p>
            </div>

            {/* Stylized CSS Barcode */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-0.5 h-6">
                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1].map((w, i) => (
                  <div 
                    key={i} 
                    className="h-full bg-slate-900 dark:bg-slate-200 rounded-xs" 
                    style={{ width: `${w}px` }} 
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-400">PRIORITY-AIR</span>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Invoice Generated</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">1-Click Dispatch</span>
          </div>
        </div>

        {/* Floating 3D Layer 1: Floating GPS Badge (Z-Index Translated forward) */}
        <div 
          className="absolute -top-4 -right-4 bg-white dark:bg-slate-850 p-2.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-750 flex items-center gap-2 pointer-events-none transition-transform duration-200"
          style={{
            transform: `translateZ(35px) scale(${isHovered ? 1.05 : 1})`,
          }}
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <MapPin size={15} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-800 dark:text-white">Dhaka Metro</p>
            <p className="text-[8px] text-emerald-500 font-semibold">24h Delivery</p>
          </div>
        </div>

        {/* Floating 3D Layer 2: Floating AI Tag (Z-Index Translated forward) */}
        <div 
          className="absolute -bottom-3 -left-3 bg-white dark:bg-slate-850 p-2.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-750 flex items-center gap-2 pointer-events-none transition-transform duration-200"
          style={{
            transform: `translateZ(45px) scale(${isHovered ? 1.05 : 1})`,
          }}
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Sparkles size={15} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-800 dark:text-white">AI Order Extracted</p>
            <p className="text-[8px] text-indigo-500 font-semibold">Ready for Courier</p>
          </div>
        </div>

      </div>
    </div>
  );
}
