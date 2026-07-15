/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'icon' | 'badge' | 'hexagon';
}

function GeometricBee({ className = '', fill = 'url(#aanpGoldGradient)' }: { className?: string; fill?: string }) {
  return (
    <g className={className}>
      {/* 1. Antennae */}
      <path
        d="M 293,72 C 286,55 272,50 263,55"
        fill="none"
        stroke={fill}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 307,72 C 314,55 328,50 337,55"
        fill="none"
        stroke={fill}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* 2. Head */}
      <ellipse cx="300" cy="85" rx="18" ry="14" fill={fill} />

      {/* 3. Thorax with central Hexagon hole (evenodd fill rule for natural transparency) */}
      <path
        d="M 300,103 L 340,118 L 340,162 L 300,182 L 260,162 L 260,118 Z M 300,118 L 282,128.5 L 282,151.5 L 300,162 L 318,151.5 L 318,128.5 Z"
        fill={fill}
        fillRule="evenodd"
      />

      {/* 4. Abdomen - 4 segments */}
      <polygon
        points="265,188 335,188 338,210 262,210"
        fill={fill}
      />
      <polygon
        points="260,215 340,215 334,242 266,242"
        fill={fill}
      />
      <polygon
        points="268,247 332,247 322,274 278,274"
        fill={fill}
      />
      <polygon
        points="280,279 320,279 300,312"
        fill={fill}
      />

      {/* 5. Right Wings */}
      {/* Top right wing facet 1 */}
      <polygon
        points="315,115 410,75 510,65 425,125 315,135"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Middle right wing facet 2 */}
      <polygon
        points="315,135 425,125 505,75 490,120 415,145 315,145"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Bottom right wing facet 3 */}
      <polygon
        points="315,145 415,145 490,120 460,145 390,165 315,155"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Lower right wing */}
      <polygon
        points="310,165 365,185 410,175 385,210 330,195 310,175"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />

      {/* 6. Left Wings */}
      {/* Top left wing facet 1 */}
      <polygon
        points="285,115 190,75 90,65 175,125 285,135"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Middle left wing facet 2 */}
      <polygon
        points="285,135 175,125 95,75 110,120 185,145 285,145"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Bottom left wing facet 3 */}
      <polygon
        points="285,145 185,145 110,120 140,145 210,165 285,155"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Lower left wing */}
      <polygon
        points="290,165 235,185 190,175 215,210 270,195 290,175"
        fill={fill}
        stroke="#8b6508"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
    </g>
  );
}

export default function Logo({ className = '', size = 120, variant = 'full' }: LogoProps) {
  // Gold gradient used for rendering the gold bee
  const GradientDef = () => (
    <defs>
      <linearGradient id="aanpGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cca04c" />
        <stop offset="50%" stopColor="#b38634" />
        <stop offset="100%" stopColor="#dcb362" />
      </linearGradient>
    </defs>
  );

  // 1. HEXAGON VARIANT (For Header)
  if (variant === 'hexagon') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="shrink-0"
        >
          <GradientDef />
          {/* Hexagon shape with dark blue fill and gold border */}
          <polygon
            points="50,5 90,28 90,72 50,95 10,72 10,28"
            fill="#0b2c4c"
            stroke="url(#aanpGoldGradient)"
            strokeWidth="4.5"
          />
          {/* Symmetrical golden bee fitted inside the hexagon */}
          <g transform="translate(7.1, 22.5) scale(0.143)">
            <GeometricBee />
          </g>
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-sans font-black text-[#0b2c4c] dark:text-zinc-100 text-xs md:text-sm leading-tight uppercase tracking-wide">
            Associação Nacional de
          </span>
          <span className="font-sans font-black text-[#0b2c4c] dark:text-zinc-100 text-xs md:text-sm leading-tight uppercase tracking-wide">
            Apicultores de Portugal
          </span>
        </div>
      </div>
    );
  }

  // 2. ICON ONLY VARIANT
  if (variant === 'icon' || variant === 'badge') {
    return (
      <svg
        viewBox="0 0 600 350"
        width={size}
        height={size}
        className={`select-none ${className}`}
      >
        <GradientDef />
        <g transform="translate(0, 10)">
          <GeometricBee />
        </g>
      </svg>
    );
  }

  // 3. FULL LOGO VARIANT (The main centered brand logo)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <svg
        viewBox="0 0 600 480"
        width={size}
        height={size}
        className="max-w-full h-auto"
        role="img"
        aria-label="Logótipo Oficial AANP - Associação de Apicultores do Norte de Portugal"
      >
        <GradientDef />

        {/* 1. Golden Bee Artwork */}
        <g transform="translate(0, 10)">
          <GeometricBee />
        </g>

        {/* 2. Official Brand Typography */}
        <g className="font-sans font-black tracking-wide text-center">
          <text
            x="300"
            y="365"
            textAnchor="middle"
            className="fill-zinc-900 dark:fill-zinc-100 text-[25px]"
          >
            ASSOCIAÇÃO DE APICULTORES DO
          </text>
          <text
            x="300"
            y="408"
            textAnchor="middle"
            className="fill-zinc-900 dark:fill-zinc-100 text-[25px]"
          >
            NORTE DE PORTUGAL (AANP)
          </text>
          <text
            x="300"
            y="450"
            textAnchor="middle"
            className="fill-[#0e5c94] dark:fill-blue-400 text-[16px] tracking-[0.25em]"
          >
            FUNDADA EM 1959
          </text>
        </g>
      </svg>
    </div>
  );
}
