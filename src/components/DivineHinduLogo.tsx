
import React from 'react';

export default function DivineHinduLogo() {
  return (
    <div className="flex items-center gap-4">

      <svg width="58" height="58" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">

        <g fill="#F26122">

          <rect x="0" y="0" width="8" height="8" />
          <rect x="14" y="0" width="8" height="8" />
          <rect x="28" y="0" width="8" height="8" />
          <rect x="0" y="14" width="8" height="8" />
          <rect x="0" y="28" width="8" height="8" />

          <rect x="0" y="92" width="8" height="8" />
          <rect x="14" y="92" width="8" height="8" />
          <rect x="28" y="92" width="8" height="8" />
          <rect x="0" y="78" width="8" height="8" />
          <rect x="0" y="64" width="8" height="8" />
        </g>

        <g stroke="#F26122" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter">

          <path d="M 42 4 L 96 4 L 96 32 L 82 32" />

          <path d="M 96 46 L 96 96 L 42 96" />

          <line x1="4" y1="42" x2="4" y2="50" />

          <line x1="32" y1="32" x2="32" y2="68" />
          <line x1="68" y1="32" x2="68" y2="68" />

          <line x1="18" y1="50" x2="82" y2="50" />

          <path d="M 18 50 L 18 18 L 50 18" />
          <path d="M 50 82 L 82 82 L 82 50" />

          <line x1="32" y1="32" x2="68" y2="32" />
          <line x1="68" y1="68" x2="32" y2="68" />
        </g>
      </svg>

      <div className="flex flex-col justify-center">
        <div className="flex flex-col leading-[1.1]">

          <div className="text-[28px] font-sans font-bold tracking-[0.1em] text-[#1a1a1a] flex items-end">
            <span className="mb-0.5">D</span>
            <div className="flex flex-col items-center justify-end mx-[3px] mb-[3px]">
              <div className="w-[6px] h-[6px] bg-[#F26122] mb-1"></div>
              <div className="w-[5px] h-[19px] bg-[#1a1a1a]"></div>
            </div>
            <span className="mb-0.5">V</span>
            <div className="flex flex-col items-center justify-end mx-[3px] mb-[3px]">
              <div className="w-[6px] h-[6px] bg-[#F26122] mb-1"></div>
              <div className="w-[5px] h-[19px] bg-[#1a1a1a]"></div>
            </div>
            <span className="mb-0.5">NE</span>
          </div>

          <div className="text-[28px] font-sans font-bold tracking-[0.1em] text-[#1a1a1a] flex items-end -mt-1.5">
            <span className="mb-0.5">H</span>
            <div className="flex flex-col items-center justify-end mx-[3px] mb-[3px]">
              <div className="w-[6px] h-[6px] bg-[#F26122] mb-1"></div>
              <div className="w-[5px] h-[19px] bg-[#1a1a1a]"></div>
            </div>
            <span className="mb-0.5">NDU</span>
          </div>
        </div>

        <div className="text-[9px] uppercase font-semibold tracking-[0.22em] text-[#1a1a1a] mt-1.5 whitespace-nowrap pl-0.5">
          Healthy <span className="mx-1 font-black leading-none text-xs">·</span> Vedic <span className="mx-1 font-black leading-none text-xs">·</span> Lifestyle
        </div>
      </div>
    </div>
  );
}
