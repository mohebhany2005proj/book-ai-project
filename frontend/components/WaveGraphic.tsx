'use client';

import { useEffect, useRef } from 'react';

export default function WaveGraphic() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('path');
    paths.forEach((path, index) => {
      path.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 800 500"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#000', stopOpacity: 0.05 }} />
            <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 0.02 }} />
          </linearGradient>
        </defs>

        {/* Abstract flowing wave paths */}
        <path
          d="M 50 250 Q 150 150, 250 250 T 450 250 T 650 250 T 850 250"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="80"
          opacity="0.3"
          className="animate-wave"
        />
        
        <path
          d="M 0 200 Q 100 100, 200 200 T 400 200 T 600 200 T 800 200"
          fill="none"
          stroke="#000"
          strokeWidth="60"
          opacity="0.08"
          className="animate-wave"
          style={{ animationDelay: '0.5s' }}
        />
        
        <path
          d="M 100 300 Q 200 200, 300 300 T 500 300 T 700 300 T 900 300"
          fill="none"
          stroke="#000"
          strokeWidth="100"
          opacity="0.05"
          className="animate-wave"
          style={{ animationDelay: '1s' }}
        />
        
        <path
          d="M -50 350 Q 50 250, 150 350 T 350 350 T 550 350 T 750 350"
          fill="none"
          stroke="#000"
          strokeWidth="70"
          opacity="0.06"
          className="animate-wave"
          style={{ animationDelay: '1.5s' }}
        />
        
        <path
          d="M 150 150 Q 250 50, 350 150 T 550 150 T 750 150"
          fill="none"
          stroke="#000"
          strokeWidth="90"
          opacity="0.04"
          className="animate-wave"
          style={{ animationDelay: '2s' }}
        />

        {/* Additional subtle lines for depth */}
        <path
          d="M 200 400 Q 300 300, 400 400 T 600 400 T 800 400"
          fill="none"
          stroke="#000"
          strokeWidth="50"
          opacity="0.03"
          className="animate-wave"
          style={{ animationDelay: '2.5s' }}
        />
        
        <path
          d="M 0 100 Q 100 50, 200 100 T 400 100 T 600 100 T 800 100"
          fill="none"
          stroke="#000"
          strokeWidth="40"
          opacity="0.04"
          className="animate-wave"
          style={{ animationDelay: '3s' }}
        />
      </svg>
    </div>
  );
}

// Made with Bob - Version 3