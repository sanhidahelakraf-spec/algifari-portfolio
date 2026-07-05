import React from 'react';
import { motion } from 'motion/react';
import { Project, PortfolioConfig } from '../types';
import { ArrowDown, ChevronRight, FileText, Github, Linkedin, Mail, Send, Sparkles } from 'lucide-react';

interface HeroProps {
  config: PortfolioConfig;
  projectsCount: number;
}

export default function Hero({ config, projectsCount }: HeroProps) {
  // Determine availability styling
  const getAvailabilityColor = () => {
    switch (config.availability) {
      case 'Available':
        return 'bg-emerald-500 text-emerald-700 bg-emerald-50';
      case 'Freelance':
        return 'bg-sky-500 text-sky-700 bg-sky-50';
      default:
        return 'bg-amber-500 text-amber-700 bg-amber-50';
    }
  };

  const getAvailabilityLabel = () => {
    switch (config.availability) {
      case 'Available':
        return 'Tersedia untuk Pekerjaan Penuh Waktu';
      case 'Freelance':
        return 'Tersedia untuk Freelance / Kontrak';
      default:
        return 'Sedang Sibuk / Tidak Tersedia';
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-100 to-transparent opacity-50 -z-10"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 -z-10" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content (7 columns on large screens) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-widest w-fit"
            >
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse"></span>
              <span className="font-mono text-[10px]">
                {getAvailabilityLabel()}
              </span>
            </motion.div>

            {/* Main Catchy Heading */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-slate-900 leading-[1.1] tracking-tight"
              >
                {(() => {
                  const words = config.title.trim().split(' ');
                  const lastWord = words.pop() || '';
                  const restTitle = words.join(' ');
                  return (
                    <>
                      {restTitle && `${restTitle} `}
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-blue-600">
                        {lastWord}
                      </span>
                      <span className="text-sky-500">.</span>
                    </>
                  );
                })()}
              </motion.h1>
            </div>

            {/* Professional Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-slate-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Saya <span className="font-bold text-slate-800">{config.name}</span>. {config.aboutText}
            </motion.p>

            {/* Action Buttons (CTAs) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <a
                href="#contact"
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2 shadow-lg hover:bg-slate-800"
              >
                <span>Mulai Kolaborasi</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#projects"
                className="border-2 border-slate-200 text-slate-600 bg-white/80 px-8 py-4 rounded-2xl font-bold hover:bg-white hover:border-sky-200 transition-all flex items-center gap-2"
              >
                <span>Lihat Portofolio</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
            </motion.div>

            {/* Social Icons & Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center lg:justify-start gap-6 pt-6 border-t border-slate-200 max-w-lg"
            >
              {(config.githubUrl || config.linkedinUrl || config.instagramUrl) && (
                <>
                  <div className="flex items-center gap-3">
                    {config.githubUrl && (
                      <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 p-2 text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-colors bg-white shadow-sm">
                        <Github size={18} />
                      </a>
                    )}
                    {config.linkedinUrl && (
                      <a href={config.linkedinUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 p-2 text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-colors bg-white shadow-sm">
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>

                  <div className="h-5 w-px bg-slate-200" />
                </>
              )}

              <div className="flex gap-4 text-xs font-semibold text-slate-500">
                <div>
                  <span className="text-slate-900 font-extrabold text-sm">{projectsCount}+</span> Proyek Selesai
                </div>
                <div>
                  <span className="text-slate-900 font-extrabold text-sm">4+</span> Tahun Pengalaman
                </div>
              </div>
            </motion.div>

          </div>

          {/* Interactive visual layout (5 columns on large screens) */}
          <div className="lg:col-span-6 relative h-full flex items-center justify-center">
            {config.photoUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative w-full max-w-sm mx-auto"
              >
                {/* Decorative blur accents */}
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-sky-300 rounded-full blur-3xl opacity-40 -z-10" />
                <div className="absolute -bottom-10 -right-8 w-48 h-48 bg-indigo-300 rounded-full blur-3xl opacity-30 -z-10" />

                {/* Photo Card */}
                <div className="relative rounded-[40px] border border-white bg-white p-3 shadow-2xl shadow-sky-200/60">
                  <img
                    src={config.photoUrl}
                    alt={config.name}
                    className="w-full aspect-[4/5] object-cover rounded-[32px]"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-lg border border-slate-100 whitespace-nowrap">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700">{config.title}</span>
                </div>
              </motion.div>
            ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="grid grid-cols-2 gap-4 w-full"
            >
              {/* Left staggered box */}
              <div className="bg-white p-5 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col gap-4 transform translate-y-8 border border-slate-100">
                <div className="w-full h-36 bg-sky-50 rounded-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/50 to-blue-200/30 mix-blend-overlay"></div>
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="w-2/3 h-2 bg-sky-300/60 rounded-full"></div>
                    <div className="w-1/2 h-2 bg-sky-200/60 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Mobile App Interface</h3>
                  <p className="text-3xs text-slate-400 uppercase font-bold tracking-wider mt-0.5">UI/UX Design • 2026</p>
                </div>
              </div>

              {/* Right staggered box */}
              <div className="bg-white p-5 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col gap-4 border border-slate-100">
                <div className="w-full h-36 bg-blue-50 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-indigo-400 rounded-full blur-xl opacity-40"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="w-1/2 h-2 bg-indigo-300/60 rounded-full"></div>
                    <div className="w-3/4 h-2 bg-indigo-200/60 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Web Dashboard</h3>
                  <p className="text-3xs text-slate-400 uppercase font-bold tracking-wider mt-0.5">Frontend Dev • 2026</p>
                </div>
              </div>

              {/* Wide Card Below */}
              <div className="col-span-2 bg-gradient-to-r from-sky-500 to-blue-600 p-8 rounded-[40px] shadow-2xl shadow-sky-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Sparkles size={48} className="text-white animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                
                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-[10px] uppercase font-bold text-white tracking-wider mb-3 backdrop-blur-md">
                    Highlight Proyek
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-2">Platform Terintegrasi</h2>
                  <p className="text-sky-100 text-xs max-w-sm leading-relaxed">
                    Membangun dashboard cerdas fungsional dengan antarmuka yang sangat responsif dan elegan.
                  </p>
                  <div className="mt-5 flex gap-2">
                    <span className="px-3 py-1 bg-white/15 rounded-lg text-3xs font-bold text-white backdrop-blur-md">React</span>
                    <span className="px-3 py-1 bg-white/15 rounded-lg text-3xs font-bold text-white backdrop-blur-md">Tailwind</span>
                    <span className="px-3 py-1 bg-white/15 rounded-lg text-3xs font-bold text-white backdrop-blur-md">Framer</span>
                  </div>
                </div>
              </div>
            </motion.div>
            )}
          </div>

        </div>
        
        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center justify-center pt-16 cursor-pointer"
          onClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Eksplor Portofolio</span>
          <ArrowDown size={14} className="text-slate-400" />
        </motion.div>
      </div>

    </section>
  );
}