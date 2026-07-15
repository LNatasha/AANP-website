/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, ShieldCheck, Users, HelpCircle } from 'lucide-react';
import { AccessibilitySettings } from '../types';
import { speakText } from '../utils';

interface HeroProps {
  onNavigate: (tab: string) => void;
  accessibility: AccessibilitySettings;
}

export default function Hero({ onNavigate, accessibility }: HeroProps) {
  const isHighContrast = accessibility.contrast === 'high';
  const isDarkMode = accessibility.contrast === 'dark' || accessibility.contrast === 'high';

  const headingText = "Impacto da AANP: Dados em Tempo Real";
  const subtitleText = "Nossa comunidade fortalece a apicultura em Portugal com dados e colaboração";
  const ttsText = `${headingText}. 4.250 membros ativos, 750.000 colmeias protegidas, 30 anos de defesa. ${subtitleText}`;

  const handleSpeak = () => {
    speakText(ttsText, true);
  };

  // Modern SVG Beekeeper icon to match the screenshot
  const BeekeeperIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 shrink-0 text-[#0b2c4c] dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* 1. Body/Shoulders/Vest */}
      <path d="M25,80 C25,68 33,62 42,61 L58,61 C67,62 75,68 75,80" fill="#cca04c" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      {/* Vest details: neck opening and center zipper line */}
      <path d="M42,61 L50,69 L58,61" stroke="currentColor" strokeWidth="2" />
      <path d="M50,69 L50,80" stroke="currentColor" strokeWidth="2" />
      {/* Vest pockets/accents */}
      <line x1="33" y1="72" x2="41" y2="72" stroke="currentColor" strokeWidth="1.5" />
      <line x1="59" y1="72" x2="67" y2="72" stroke="currentColor" strokeWidth="1.5" />

      {/* 2. Veil (Protective Screen) */}
      <path d="M34,44 L31,65 C31,67 33,69 35,69 L65,69 C67,69 69,67 69,65 L66,44" fill="#a5f3fc" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      {/* Vertical net lines */}
      <line x1="38" y1="45" x2="36" y2="69" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="45" x2="44" y2="69" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="50" y1="45" x2="50" y2="69" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="56" y1="45" x2="56" y2="69" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="62" y1="45" x2="64" y2="69" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

      {/* 3. Head/Face inside */}
      <circle cx="50" cy="42" r="11" fill="currentColor" fillOpacity="0.1" />

      {/* 4. Hat */}
      <path d="M37,33 C37,20 63,20 63,33 Z" fill="#b38634" fillOpacity="0.8" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="50" cy="33" rx="22" ry="6" fill="#cca04c" fillOpacity="0.9" stroke="currentColor" strokeWidth="2.5" />
      <path d="M37.5,31.5 C42,29.5 58,29.5 62.5,31.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

  // Modern SVG Beehive icon to match the screenshot
  const BeehiveIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 shrink-0 text-[#0b2c4c] dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* 1. Gabled Roof */}
      <polygon points="50,15 22,32 78,32" fill="#cca04c" fillOpacity="0.9" stroke="currentColor" strokeWidth="2.5" />
      
      {/* 2. Stacked Boxes (3 levels) */}
      {/* Level 1 (top) */}
      <rect x="26" y="32" width="48" height="13" fill="#cca04c" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M44,38.5 C44,41.5 56,41.5 56,38.5" fill="none" stroke="currentColor" strokeWidth="2" />

      {/* Level 2 (middle) */}
      <rect x="26" y="45" width="48" height="13" fill="#cca04c" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M44,51.5 C44,54.5 56,54.5 56,51.5" fill="none" stroke="currentColor" strokeWidth="2" />

      {/* Level 3 (bottom) */}
      <rect x="26" y="58" width="48" height="13" fill="#cca04c" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M44,64.5 C44,67.5 56,67.5 56,64.5" fill="none" stroke="currentColor" strokeWidth="2" />

      {/* 3. Base & Legs */}
      <path d="M30,71 L30,78 M70,71 L70,78" stroke="currentColor" strokeWidth="3" />
    </svg>
  );

  // Modern SVG Shield check icon
  const ShieldCheckIcon = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 shrink-0 text-[#0b2c4c] dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Golden Shield */}
      <path d="M50,15 C66,15 80,19 80,29 C80,55 65,75 50,85 C35,75 20,55 20,29 C20,19 34,15 50,15 Z" fill="#cca04c" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      {/* Inner border line of the shield */}
      <path d="M50,21 C62.5,21 73,24 73,32 C73,52 61,69 50,78 C39,69 27,52 27,32 C27,24 37.5,21 50,21 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
      {/* Big beautiful bold checkmark */}
      <path d="M38,48 L46,56 L64,36" stroke="currentColor" strokeWidth="4.5" />
    </svg>
  );

  return (
    <section 
      id="hero-section"
      className={`relative py-12 md:py-16 transition-all duration-300 overflow-hidden ${
        isHighContrast
          ? 'bg-black text-yellow-400 border-b border-yellow-500'
          : 'bg-gradient-to-r from-[#eaf4fc] via-[#f9f9f9] to-[#fdf5e2] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-850'
      }`}
    >
      {/* Background Decorative Honeycomb Hexagons matching the screenshot style */}
      {!isHighContrast && (
        <>
          {/* Left Side Honeycomb (Blue/Indigo) */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25 dark:opacity-15 pointer-events-none text-blue-500/80 dark:text-blue-400">
            <svg width="100%" height="100%" viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="1.5">
              <g transform="translate(10, 10)">
                {/* Row 0 */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(20, 20)" opacity="0.1" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(54.64, 20)" opacity="0.2" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(89.28, 20)" opacity="0.08" />
                
                {/* Row 1 (staggered) */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(37.32, 50)" opacity="0.25" fill="currentColor" fillOpacity="0.02" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(71.96, 50)" opacity="0.15" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(106.6, 50)" opacity="0.05" />

                {/* Row 2 */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(20, 80)" opacity="0.15" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(54.64, 80)" opacity="0.3" fill="currentColor" fillOpacity="0.03" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(89.28, 80)" opacity="0.1" />

                {/* Row 3 */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(37.32, 110)" opacity="0.2" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(71.96, 110)" opacity="0.08" />
              </g>
            </svg>
          </div>

          {/* Right Side Honeycomb (Amber/Gold) */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25 dark:opacity-15 pointer-events-none text-amber-500/80 dark:text-amber-400">
            <svg width="100%" height="100%" viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="1.5">
              <g transform="translate(20, 10)">
                {/* Row 0 */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(89.28, 20)" opacity="0.1" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(54.64, 20)" opacity="0.2" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(20, 20)" opacity="0.05" />
                
                {/* Row 1 (staggered) */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(106.6, 50)" opacity="0.25" fill="currentColor" fillOpacity="0.02" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(71.96, 50)" opacity="0.22" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(37.32, 50)" opacity="0.08" />

                {/* Row 2 */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(89.28, 80)" opacity="0.2" fill="currentColor" fillOpacity="0.03" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(54.64, 80)" opacity="0.32" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(20, 80)" opacity="0.1" />

                {/* Row 3 */}
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(71.96, 110)" opacity="0.25" />
                <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" transform="translate(37.32, 110)" opacity="0.08" />
              </g>
            </svg>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Heading + TTS Speaker Button */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0b2c4c] dark:text-zinc-100">
            {headingText}
          </h1>
          <button
            onClick={handleSpeak}
            id="speak-welcome-btn"
            className={`p-2 rounded-full border transition-transform shrink-0 cursor-pointer ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-500 hover:scale-105'
                : 'bg-white dark:bg-zinc-800 text-[#0e5c94] dark:text-amber-400 hover:bg-zinc-50 hover:scale-105 border-zinc-200 dark:border-zinc-700 shadow-sm'
            }`}
            title="Ouvir dados em tempo real"
            aria-label="Ouvir dados"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        {/* Metrics Grid Container */}
        <div className={`max-w-5xl mx-auto mb-8 rounded-2xl overflow-hidden border ${
          isHighContrast
            ? 'border-yellow-500 bg-black divide-y-2 divide-yellow-500'
            : 'bg-white/75 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200/70 dark:border-zinc-800 shadow-sm divide-y md:divide-y-0 md:divide-x divide-zinc-200/70 dark:divide-zinc-800/80 grid grid-cols-1 md:grid-cols-3'
        }`}>
          
          {/* Metric 1 */}
          <div className="flex items-center justify-center gap-6 p-6 md:py-8">
            <BeekeeperIcon />
            <div className="text-left">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0b2c4c] dark:text-amber-400 tracking-tight">
                4,250+
              </span>
              <span className={`text-sm font-bold tracking-wide ${
                isHighContrast ? 'text-yellow-300' : 'text-zinc-600 dark:text-zinc-300'
              }`}>
                Membros Ativos
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center justify-center gap-6 p-6 md:py-8">
            <BeehiveIcon />
            <div className="text-left">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0b2c4c] dark:text-amber-400 tracking-tight">
                750,000+
              </span>
              <span className={`text-sm font-bold tracking-wide ${
                isHighContrast ? 'text-yellow-300' : 'text-zinc-600 dark:text-zinc-300'
              }`}>
                Colmeias Protegidas
              </span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center justify-center gap-6 p-6 md:py-8">
            <ShieldCheckIcon />
            <div className="text-left">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0b2c4c] dark:text-amber-400 tracking-tight">
                30+
              </span>
              <span className={`text-sm font-bold tracking-wide ${
                isHighContrast ? 'text-yellow-300' : 'text-zinc-600 dark:text-zinc-300'
              }`}>
                Anos de Defesa
              </span>
            </div>
          </div>

        </div>

        {/* Subtitle text */}
        <p className={`text-sm sm:text-base md:text-[17px] font-bold tracking-wide max-w-3xl mx-auto ${
          isHighContrast ? 'text-yellow-300' : 'text-zinc-600 dark:text-zinc-300'
        }`}>
          {subtitleText}
        </p>
      </div>
    </section>
  );
}
