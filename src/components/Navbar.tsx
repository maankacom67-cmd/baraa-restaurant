import React, { useState, useEffect } from 'react';
import { Menu, X, Award } from 'lucide-react';
import BaraaLogo from './BaraaLogo';

interface NavbarProps {
  currentTab: 'home' | 'menu' | 'about' | 'book' | 'reviews';
  setCurrentTab: (tab: 'home' | 'menu' | 'about' | 'book' | 'reviews') => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', label: 'HOME' },
    { key: 'menu', label: 'MENYADA' },
    { key: 'about', label: 'NAGU SAABSAN' },
    { key: 'reviews', label: 'FAALLOOYINKA' },
    { key: 'book', label: 'BALLANSO MIIS' },
  ] as const;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary-900/95 backdrop-blur-md py-3 shadow-lg border-b border-white/5'
          : 'bg-gradient-to-b from-primary-900/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 shadow-lg shadow-gold-500/10 group-hover:scale-105 transition-all duration-300">
            <BaraaLogo variant="badge" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              Baraa <span className="text-gold-400 text-xs font-sans tracking-[0.2em] font-light hidden sm:inline">RESTAURANT</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-sans tracking-wide leading-none mt-1 hidden sm:block">Dhadhanka Runta Ah</p>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentTab(item.key);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs font-sans font-semibold tracking-widest relative py-2 transition-colors cursor-pointer ${
                  isActive ? 'text-gold-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => {
              setCurrentTab('book');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gold-500 hover:bg-gold-400 text-primary-950 px-5 py-2.5 rounded-sm text-xs font-sans font-bold tracking-widest hover:shadow-lg hover:shadow-gold-500/20 transition-all active:scale-95 cursor-pointer"
          >
            DALBO MIIS
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => {
              setCurrentTab('book');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gold-500 text-primary-950 px-3.5 py-2 rounded-sm text-[11px] font-sans font-bold tracking-wider cursor-pointer"
          >
            DALBO
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white p-1 cursor-pointer focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary-950/98 backdrop-blur-lg border-b border-white/5 py-6 px-6 shadow-2xl flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentTab(item.key);
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left text-sm font-sans font-semibold tracking-wider py-2.5 border-b border-white/5 cursor-pointer ${
                  currentTab === item.key ? 'text-gold-400 pl-2 border-gold-400/30' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-sans pl-1">
            <Award className="w-4 h-4 text-gold-400" />
            <span>Maqaayada Ugu Fiican Muqdisho</span>
          </div>
        </div>
      )}
    </nav>
  );
}
