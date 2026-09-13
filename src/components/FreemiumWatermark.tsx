import React from 'react';

interface FreemiumWatermarkProps {
  opacity?: number;
  text?: string;
  className?: string;
}

export default function FreemiumWatermark({
  opacity = 0.18,
  text = 'ToneMark Free',
  className = '',
}: FreemiumWatermarkProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-10 ${className}`}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <pattern
            id="tonemark-wm"
            x="0"
            y="0"
            width="210"
            height="90"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-35 0 0)"
          >
            <text
              x="10"
              y="55"
              fontSize="13"
              fill={`rgba(255,255,255,${opacity})`}
              fontFamily="'Courier New', monospace"
              fontWeight="700"
              letterSpacing="2"
            >
              {text}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tonemark-wm)" />
      </svg>
    </div>
  );
}
