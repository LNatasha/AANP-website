/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Accessibility, Volume2, VolumeX, Eye, ZoomIn, Type, ListCollapse } from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onChange: (settings: AccessibilitySettings) => void;
}

export default function AccessibilityPanel({ settings, onChange }: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleTTSAlert = () => {
    const enabled = !settings.ttsEnabled;
    updateSetting('ttsEnabled', enabled);
    
    if (enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Assistente de voz ativado. Clique no ícone de altifalante em qualquer secção para ouvir o texto.'
      );
      utterance.lang = 'pt-PT';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative z-50">
      {/* Accessibility trigger button */}
      <button
        onClick={togglePanel}
        id="accessibility-trigger-btn"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border shadow-xs transition-colors duration-200 cursor-pointer ${
          settings.contrast === 'high'
            ? 'bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-500'
            : 'bg-amber-50 dark:bg-zinc-800 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-700'
        }`}
        title="Painel de Acessibilidade (Idosos / Apoio de Leitura)"
        aria-label="Opções de Acessibilidade"
      >
        <Accessibility className="h-4 w-4 text-amber-600 dark:text-amber-400 font-bold" />
        <span>Acessibilidade</span>
        {settings.ttsEnabled && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </button>

      {/* Settings Panel Modal */}
      {isOpen && (
        <div 
          id="accessibility-panel-modal"
          className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg ring-1 ring-black/5 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-sm">
              <Accessibility className="h-4.5 w-4.5 text-amber-500" />
              <span>Apoio à Acessibilidade</span>
            </h3>
            <button
              onClick={togglePanel}
              id="accessibility-close-btn"
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Font Size Control */}
            <div>
              <label className="block text-zinc-500 dark:text-zinc-400 font-medium mb-1.5 flex items-center gap-1">
                <ZoomIn className="h-3.5 w-3.5" />
                <span>Tamanho do Texto (Para idosos)</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => updateSetting('fontSize', 'normal')}
                  id="font-size-normal-btn"
                  className={`py-1 rounded text-center transition-colors font-medium cursor-pointer ${
                    settings.fontSize === 'normal'
                      ? 'bg-amber-500 text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-700'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('fontSize', 'large')}
                  id="font-size-large-btn"
                  className={`py-1 rounded text-center transition-colors font-medium cursor-pointer ${
                    settings.fontSize === 'large'
                      ? 'bg-amber-500 text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-700'
                  }`}
                >
                  Grande
                </button>
                <button
                  onClick={() => updateSetting('fontSize', 'extra-large')}
                  id="font-size-xlarge-btn"
                  className={`py-1 rounded text-center transition-colors font-medium cursor-pointer ${
                    settings.fontSize === 'extra-large'
                      ? 'bg-amber-500 text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-700'
                  }`}
                >
                  XL
                </button>
              </div>
            </div>

            {/* 2. Contrast & Theme Options */}
            <div>
              <label className="block text-zinc-500 dark:text-zinc-400 font-medium mb-1.5 flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Contraste e Cores</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-50 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => updateSetting('contrast', 'normal')}
                  id="theme-normal-btn"
                  className={`py-1 rounded text-center transition-colors font-medium cursor-pointer ${
                    settings.contrast === 'normal'
                      ? 'bg-amber-500 text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-700'
                  }`}
                >
                  Claro
                </button>
                <button
                  onClick={() => updateSetting('contrast', 'dark')}
                  id="theme-dark-btn"
                  className={`py-1 rounded text-center transition-colors font-medium cursor-pointer ${
                    settings.contrast === 'dark'
                      ? 'bg-amber-500 text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-700'
                  }`}
                >
                  Escuro
                </button>
                <button
                  onClick={() => updateSetting('contrast', 'high')}
                  id="theme-high-contrast-btn"
                  className={`py-1 rounded text-center transition-colors font-medium border cursor-pointer ${
                    settings.contrast === 'high'
                      ? 'bg-yellow-400 text-black border-yellow-500 font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-150 dark:hover:bg-zinc-700'
                  }`}
                  title="Amarelo sobre Preto de Alto Contraste"
                >
                  Contraste
                </button>
              </div>
            </div>

            {/* 3. Text to Speech Assist */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5 text-amber-500" />
                  <span>Leitor de Voz (Falar Texto)</span>
                </label>
                <button
                  onClick={handleTTSAlert}
                  id="tts-toggle-btn"
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                    settings.ttsEnabled
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {settings.ttsEnabled ? 'Ativo' : 'Inativo'}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Lê as secções em português de Portugal ao passar o rato ou clicar no altifalante.
              </p>
            </div>

            {/* 4. Dyslexia / Layout aids */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
                  <Type className="h-3.5 w-3.5" />
                  <span>Letra Fácil (Dislexia)</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.dyslexicFont}
                  onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                  id="dyslexic-font-checkbox"
                  className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
                  <ListCollapse className="h-3.5 w-3.5" />
                  <span>Espaçamento Largo</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.lineSpacing === 'wide'}
                  onChange={(e) => updateSetting('lineSpacing', e.target.checked ? 'wide' : 'normal')}
                  id="line-spacing-checkbox"
                  className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
