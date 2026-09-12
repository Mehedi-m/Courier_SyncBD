'use client';

import { useState, useEffect, useRef } from 'react';

export default function CursorTrackingAuth({ isPasswordFocused = false, showPassword = false }) {
  const [isClient, setIsClient] = useState(false);
  const mascotHeadRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const droneRef = useRef(null);
  const mascotContainerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 3;
    let droneX = mouseX;
    let droneY = mouseY;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let pupilX = 0;
    let pupilY = 0;
    let targetPupilX = 0;
    let targetPupilY = 0;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (mascotContainerRef.current) {
        const rect = mascotContainerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        const maxPupilRadius = 7;
        const pupilDist = Math.min(maxPupilRadius, distance / 35);
        targetPupilX = Math.cos(angle) * pupilDist;
        targetPupilY = Math.sin(angle) * pupilDist;

        const maxTilt = 14;
        targetTiltX = Math.max(-maxTilt, Math.min(maxTilt, -deltaY / 28));
        targetTiltY = Math.max(-maxTilt, Math.min(maxTilt, deltaX / 28));
      }
    };

    const updateLoop = () => {
      droneX += (mouseX - droneX) * 0.14;
      droneY += (mouseY - droneY) * 0.14;

      if (droneRef.current) {
        droneRef.current.style.transform = `translate3d(${droneX + 16}px, ${droneY - 24}px, 0)`;
      }

      tiltX += (targetTiltX - tiltX) * 0.15;
      tiltY += (targetTiltY - tiltY) * 0.15;

      if (mascotHeadRef.current) {
        mascotHeadRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      pupilX += (targetPupilX - pupilX) * 0.2;
      pupilY += (targetPupilY - pupilY) * 0.2;

      if (leftPupilRef.current && rightPupilRef.current) {
        if (!isPasswordFocused) {
          const transformStr = `translate3d(${pupilX}px, ${pupilY}px, 0)`;
          leftPupilRef.current.style.transform = transformStr;
          rightPupilRef.current.style.transform = transformStr;
        } else if (showPassword) {
          const transformStr = `translate3d(${pupilX * 0.7}px, ${pupilY * 0.7}px, 0)`;
          leftPupilRef.current.style.transform = transformStr;
          rightPupilRef.current.style.transform = transformStr;
        }
      }

      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isPasswordFocused, showPassword]);

  const isCoveringEyes = isPasswordFocused && !showPassword;
  const isPeeking = isPasswordFocused && showPassword;

  return (
    <>
      <div
        ref={droneRef}
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-300 hidden lg:block ${
          isClient ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="relative flex items-center gap-2">
          <div className="absolute -inset-2 bg-indigo-500/25 rounded-full blur-md pointer-events-none animate-pulse" />
          <img
            src="/animations/courier-drone.gif"
            alt="Drone Mascot"
            className="w-12 h-12 object-contain filter drop-shadow-lg select-none"
          />
          <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 text-[10px] font-black text-indigo-300 px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
            ⚡ Courier Express
          </div>
        </div>
      </div>

      <div
        ref={mascotContainerRef}
        className="flex flex-col items-center justify-center -mb-3 select-none relative"
        style={{ perspective: '1000px' }}
      >
        {isCoveringEyes && (
          <div className="absolute -top-7 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full shadow-lg animate-bounce z-20 flex items-center gap-1 border border-amber-300">
            <span>🙈 Shh, secret code!</span>
          </div>
        )}
        {isPeeking && (
          <div className="absolute -top-7 bg-indigo-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-lg animate-bounce z-20 flex items-center gap-1 border border-indigo-400">
            <span>👁️ Peeking at your key!</span>
          </div>
        )}

        <div
          ref={mascotHeadRef}
          className="relative w-28 h-22 transition-transform duration-75 ease-out will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute top-0 inset-x-2 h-8 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-t-2xl shadow-md border-b-2 border-indigo-950 flex items-center justify-center z-10">
            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 p-0.5 shadow-sm flex items-center justify-center border border-indigo-200">
              <img src="/logo.png" alt="Cap Badge" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="absolute -bottom-1.5 inset-x-1 h-2.5 bg-slate-950 rounded-b-lg shadow-sm" />
          </div>

          <div className="absolute top-5 inset-x-2 h-18 bg-amber-100 dark:bg-amber-200 rounded-2xl shadow-lg border border-amber-300/80 overflow-hidden flex flex-col items-center justify-center pt-2">
            <div className="flex items-center gap-4 relative z-0">
              <div className="w-7 h-7 bg-white rounded-full border border-slate-300 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div
                  ref={leftPupilRef}
                  className="w-4 h-4 bg-slate-950 rounded-full relative transition-transform duration-75 flex items-center justify-center"
                  style={{
                    transform: isCoveringEyes ? 'scaleY(0.1)' : undefined,
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div>

              <div className="w-7 h-7 bg-white rounded-full border border-slate-300 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div
                  ref={rightPupilRef}
                  className="w-4 h-4 bg-slate-950 rounded-full relative transition-transform duration-75 flex items-center justify-center"
                  style={{
                    transform: isCoveringEyes ? 'scaleY(0.1)' : undefined,
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div>
            </div>

            <div className="flex justify-between w-16 px-1 mt-1">
              <span className="w-2.5 h-1 bg-rose-400/50 rounded-full" />
              <span className="w-2.5 h-1 bg-rose-400/50 rounded-full" />
            </div>

            <div className="w-4 h-2 border-b-2 border-slate-800 rounded-b-full mt-0.5" />

            <div
              className={`absolute inset-x-1 bottom-1 flex justify-between px-2.5 transition-all duration-300 z-10 ${
                isCoveringEyes
                  ? 'translate-y-[-22px] opacity-100'
                  : isPeeking
                  ? 'translate-y-[-16px] opacity-100 rotate-[-8deg]'
                  : 'translate-y-8 opacity-0 pointer-events-none'
              }`}
            >
              <div className="w-6 h-6 bg-indigo-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[11px] font-black">
                🧤
              </div>
              <div className="w-6 h-6 bg-indigo-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[11px] font-black">
                {isPeeking ? '✌️' : '🧤'}
              </div>
            </div>
          </div>

          <div className="absolute top-8 -left-1.5 w-3.5 h-7 bg-slate-900 rounded-l-lg shadow-sm border-r border-slate-700" />
          <div className="absolute top-8 -right-1.5 w-3.5 h-7 bg-slate-900 rounded-r-lg shadow-sm border-l border-slate-700" />
        </div>
      </div>
    </>
  );
}
