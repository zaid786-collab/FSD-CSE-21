import React from 'react';

export function BrandMark({ size = 32, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-opacity duration-200 hover:opacity-85"
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="8" fill="#171713" />
        <rect x="1" y="1" width="62" height="62" rx="7" stroke="#2A2A24" strokeWidth="1.5" />
        {/* MZK Technical Monogram in Gold */}
        <path
          d="M17 45V19L27 34L37 19V45"
          stroke="#D4AF37"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M40 45L49 19" stroke="#EDEDEB" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 45H53" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className="font-mono text-xs font-semibold tracking-wider text-[#EDEDEB]">
          MZK<span className="text-[#D4AF37]">.</span>
        </span>
      )}
    </div>
  );
}
