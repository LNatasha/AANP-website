/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, MessageCircle, MessageSquare, ChevronDown, ShoppingCart } from 'lucide-react';
import { AccessibilitySettings } from '../types';
import AccessibilityPanel from './AccessibilityPanel';
import Logo from './Logo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: AccessibilitySettings) => void;
  isPortalLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  portalMemberName?: string;
  adminName?: string;
  onLogout: () => void;
  cartItemsCount: number;
  onOpenCart: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  accessibility, 
  setAccessibility,
  isPortalLoggedIn,
  isAdminLoggedIn,
  portalMemberName,
  adminName,
  onLogout,
  cartItemsCount,
  onOpenCart
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'inicio', label: 'Sobre', hasDropdown: true },
    { id: 'membros', label: 'Membros', hasDropdown: true },
    { id: 'recursos', label: 'Recursos', hasDropdown: true },
    { id: 'loja', label: 'Loja', hasDropdown: false },
    { id: 'noticias', label: 'Notícias', hasDropdown: false },
    { id: 'contactos', label: 'Contato', hasDropdown: false },
  ];

  // Dynamic portal tab name with user/admin name
  if (isPortalLoggedIn) {
    if (isAdminLoggedIn) {
      navItems.push({ id: 'portal', label: `⚙️ ${adminName || 'Admin'}`, hasDropdown: false });
    } else {
      navItems.push({ id: 'portal', label: `👤 ${portalMemberName || 'Sócio'}`, hasDropdown: false });
    }
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHighContrast = accessibility.contrast === 'high';

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        isHighContrast
          ? 'bg-black text-yellow-400 border-yellow-500'
          : 'bg-white/95 dark:bg-zinc-950/95 text-zinc-900 dark:text-zinc-50 border-zinc-100 dark:border-zinc-850'
      } backdrop-blur-md`}
    >
      {/* Top Banner with Direct Support */}
      <div 
        id="top-emergency-bar"
        className={`text-xs py-1.5 px-4 flex flex-wrap justify-between items-center gap-2 border-b ${
          isHighContrast
            ? 'bg-black text-yellow-300 border-yellow-500'
            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800'
        }`}
      >
        <span className="font-medium">
          📞 AANP: <a href="tel:+351225098976" className="underline hover:text-[#0e5c94] dark:hover:text-blue-400 font-semibold">225 098 976</a>
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/351939702495?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20a%20AANP."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1 font-semibold text-[11px]"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://m.me/apicultores.norte"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1 font-semibold text-[11px]"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>Messenger</span>
          </a>
          <span className="opacity-70">|</span>
          <AccessibilityPanel settings={accessibility} onChange={setAccessibility} />
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Hexagonal Modern Logo */}
        <button
          onClick={() => handleNavClick('inicio')}
          id="logo-btn"
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
        >
          <Logo variant="hexagon" size={38} />
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || 
              (item.id === 'recursos' && ['servicos', 'apoio-sanitario', 'declaracao'].includes(activeTab));
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`nav-${item.id}`}
                className={`flex items-center gap-1 px-1 py-2 text-[13px] font-bold tracking-wide transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? isHighContrast
                      ? 'text-yellow-400 border-b-2 border-yellow-400 font-black'
                      : 'text-[#0e5c94] dark:text-amber-400 font-extrabold border-b-2 border-[#0e5c94] dark:border-amber-400'
                    : isHighContrast
                      ? 'text-yellow-300/80 hover:text-yellow-300'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-[#0e5c94] dark:hover:text-amber-400'
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side: Portal do Membro Button & Cart */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={onOpenCart}
            id="header-cart-btn"
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              isHighContrast
                ? 'text-yellow-400 hover:bg-zinc-950 border border-yellow-500'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-[#0e5c94] dark:hover:text-amber-400'
            }`}
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </button>

          {isPortalLoggedIn ? (
            <button
              onClick={onLogout}
              className="px-3 py-2 text-xs font-bold bg-red-650 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Terminar Sessão
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('portal')}
              id="header-portal-btn"
              className={`px-4 py-2 text-xs font-bold rounded-lg tracking-wide shadow-xs transition-colors cursor-pointer ${
                isHighContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold border-2 border-yellow-500'
                  : 'bg-[#0e5c94] text-white hover:bg-opacity-90'
              }`}
            >
              Portal do Membro
            </button>
          )}
        </div>

        {/* Mobile Cart & menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenCart}
            id="mobile-cart-btn"
            className={`relative p-2 rounded-lg cursor-pointer ${
              isHighContrast
                ? 'text-yellow-400 hover:bg-zinc-900'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="h-5.5 w-5.5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-trigger-btn"
            className={`p-2 rounded-lg cursor-pointer ${
              isHighContrast
                ? 'text-yellow-400 hover:bg-zinc-900'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-150'
            }`}
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-drawer-menu"
          className={`lg:hidden border-t px-4 py-3 space-y-1 animate-in slide-in-from-top-4 duration-200 ${
            isHighContrast
              ? 'bg-black border-yellow-500 text-yellow-400'
              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id || 
              (item.id === 'recursos' && ['servicos', 'apoio-sanitario', 'declaracao'].includes(activeTab));
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`mobile-nav-${item.id}`}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black font-extrabold'
                      : 'bg-blue-100 dark:bg-zinc-800 text-[#0e5c94] dark:text-[#38bdf8]'
                    : isHighContrast
                      ? 'hover:bg-zinc-900 text-yellow-400'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-200'
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown className="h-4 w-4 opacity-60" />
                )}
              </button>
            );
          })}
          
          <div className="pt-2 border-t mt-2">
            {isPortalLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-3 text-sm font-bold bg-red-650 hover:bg-red-750 text-white rounded-xl text-center cursor-pointer"
              >
                Terminar Sessão
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('portal');
                }}
                className={`w-full px-4 py-3 text-sm font-bold rounded-xl tracking-wide text-center transition-colors cursor-pointer ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black font-extrabold'
                    : 'bg-[#0e5c94] text-white hover:bg-opacity-90'
                }`}
              >
                Portal do Membro
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
