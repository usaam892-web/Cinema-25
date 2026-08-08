import React from 'react';

export const CinemaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} group-hover:scale-105 transition-transform duration-300`}>
      {/* Outer Glowing Ring & Backdrop */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-800 via-red-600 to-amber-500 p-[1.5px] shadow-lg shadow-red-600/50">
        <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          
          {/* Subtle Background Radial Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-red-950/20 to-transparent pointer-events-none" />
          
          {/* Professional Cinema Play Crown SVG Logo */}
          <svg className="w-6 h-6 z-10 drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2a4b" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="logoGoldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fca5a5" />
              </linearGradient>
            </defs>

            {/* Outer Diamond Crest */}
            <path
              d="M50 10 L82 28 L82 72 L50 90 L18 72 L18 28 Z"
              fill="url(#logoRedGrad)"
              stroke="#f87171"
              strokeWidth="2.5"
            />

            {/* Inner Golden Crown Line */}
            <path
              d="M50 18 L74 32 L74 68 L50 82 L26 68 L26 32 Z"
              fill="none"
              stroke="url(#logoGoldHighlight)"
              strokeWidth="1.5"
              strokeDasharray="5 2"
              opacity="0.8"
            />

            {/* Center Play Button Triangle */}
            <path
              d="M42 34 L68 50 L42 66 Z"
              fill="#ffffff"
            />

            {/* Top Crown Sparkle Stars */}
            <circle cx="50" cy="24" r="2.5" fill="#ffffff" />
            <circle cx="36" cy="30" r="1.5" fill="#fecdd3" />
            <circle cx="64" cy="30" r="1.5" fill="#fecdd3" />
          </svg>
        </div>
      </div>
    </div>
  );
};
