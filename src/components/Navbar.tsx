import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, LogOut, ArrowRight, Home, Layout, Mail, User2, Laptop } from 'lucide-react';
import { PortfolioConfig } from '../types';

interface NavbarProps {
  config: PortfolioConfig;
  isAdminLoggedIn: boolean;
  viewMode: 'portfolio' | 'admin';
  setViewMode: (mode: 'portfolio' | 'admin') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({
  config,
  isAdminLoggedIn,
  viewMode,
  setViewMode,
  onOpenLogin,
  onLogout,
}: NavbarProps) {
  const isDashboard = viewMode === 'admin';
  const initial = config.name.trim().charAt(0).toUpperCase() || 'A';

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-0 z-40 border-b border-slate-100/80 bg-white/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        {/* Logo / Title */}
        <a 
          href="#home" 
          onClick={(e) => {
            if (isDashboard) {
              e.preventDefault();
              setViewMode('portfolio');
            }
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-200 transition-all group-hover:scale-105">
            {initial}
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-500">
            {config.name}<span className="text-sky-500 underline decoration-2 underline-offset-4">.Studio</span>
          </span>
        </a>

        {/* Desktop Navigation links */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <a href="#about" className="text-sm text-slate-500 hover:text-sky-500 transition-colors">About</a>
            <a href="#skills" className="text-sm text-slate-500 hover:text-sky-500 transition-colors">Skills</a>
            <a href="#projects" className="text-sm text-slate-500 hover:text-sky-500 transition-colors">Projects</a>
            <a href="#experience" className="text-sm text-slate-500 hover:text-sky-500 transition-colors">Experience</a>
            <a href="#contact" className="text-sm text-slate-500 hover:text-sky-500 transition-colors">Contact</a>
          </nav>
        )}

        {/* Actions Button */}
        <div className="flex items-center gap-3">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              {isDashboard ? (
                <button
                  onClick={() => setViewMode('portfolio')}
                  className="flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-5 py-2.5 text-xs font-bold text-sky-700 transition-all hover:bg-sky-100 active:scale-95"
                >
                  <Home size={14} />
                  <span className="hidden sm:inline">Lihat Portofolio</span>
                </button>
              ) : (
                <button
                  onClick={() => setViewMode('admin')}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-200 transition-all hover:brightness-105 active:scale-95"
                >
                  <Layout size={14} />
                  <span>Dashboard Admin</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition-all hover:bg-slate-50 hover:text-red-500"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full shadow-md shadow-sky-200/50 hover:shadow-lg hover:shadow-sky-300/60 transition-all text-xs font-bold tracking-wide active:scale-95 flex items-center gap-1.5"
            >
              <ShieldAlert size={14} className="text-sky-200" />
              <span>Login Admin</span>
            </button>
          )}
        </div>

      </div>
    </motion.header>
  );
}