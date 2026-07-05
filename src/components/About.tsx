import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill, Experience, PortfolioConfig } from '../types';
import LucideIcon from './LucideIcon';
import { Sparkles, Calendar, Award, GraduationCap, Briefcase } from 'lucide-react';

interface AboutProps {
  config: PortfolioConfig;
  skills: Skill[];
  experiences: Experience[];
}

export default function About({ config, skills, experiences }: AboutProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Frontend' | 'Backend' | 'Design' | 'Others'>('All');

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="about" className="relative bg-slate-50 py-24 scroll-mt-16">
      
      {/* Decorative vector overlays */}
      <div className="absolute right-0 top-1/4 pointer-events-none h-64 w-64 rounded-full bg-sky-200/10 blur-3xl" />
      <div className="absolute left-0 bottom-1/4 pointer-events-none h-64 w-64 rounded-full bg-indigo-200/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/60 px-3.5 py-1.5 text-xs font-semibold text-sky-700 uppercase tracking-wider font-mono">
            <Sparkles size={12} className="text-sky-500" />
            Tentang Saya
          </span>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Perjalanan Karir & <span className="text-sky-500">Keahlian Profesional</span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-xl text-sm text-slate-500 leading-relaxed">
            Menyelaraskan kode bersih dengan pengalaman pengguna visual yang menakjubkan untuk mencapai hasil terbaik.
          </p>
        </div>

        {/* Narrative bio and skills grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Narrative Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1.5 w-1/2 bg-sky-400" />
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">Profil Singkat</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {config.aboutText}
              </p>
              
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Profesional Berorientasi Hasil</h4>
                    <p className="text-2xs text-slate-500 mt-0.5">Memiliki standar tinggi dalam kebersihan & optimasi kode.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Belajar Berkelanjutan</h4>
                    <p className="text-2xs text-slate-500 mt-0.5">Selalu beradaptasi dengan tren, alat, dan kerangka kerja terbaru.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Skills categorized block */}
          <div id="skills" className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-display text-xl font-extrabold text-slate-900">Keahlian Teknis</h3>
                
                {/* Category selectors */}
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Frontend', 'Backend', 'Design', 'Others'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-4 py-1.5 text-3xs font-extrabold uppercase tracking-wider transition-all ${
                        activeCategory === category
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category === 'All' ? 'Semua' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      key={skill.id}
                      className="rounded-2xl border border-slate-50 bg-slate-50/40 p-4 hover:bg-sky-50/20 hover:border-sky-100 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-500 border border-slate-100 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-sm">
                          <LucideIcon name={skill.icon} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate">{skill.name}</h4>
                          <span className="text-3xs text-slate-400 font-mono mt-0.5 block uppercase tracking-wider leading-none">{skill.category}</span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-700 font-mono group-hover:text-sky-500 transition-colors">{skill.level}%</span>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* Career Timeline Experience Section */}
        <div id="experience" className="mt-20 scroll-mt-20">
          <div className="mb-12 text-center max-w-lg mx-auto">
            <h3 className="font-display text-2xl font-extrabold text-slate-900">Pengalaman Kerja</h3>
            <p className="text-xs text-slate-500 mt-2">Daftar perjalanan karir profesional saya di dunia industri pengembangan teknologi digital.</p>
          </div>

          <div className="relative max-w-3xl mx-auto pl-6 md:pl-0">
            {/* Center line for desktop, left line for mobile */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-indigo-400 to-transparent" />

            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={exp.id} 
                  className={`relative mb-12 md:flex md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-3.5 md:-translate-x-4 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/20 border-4 border-white z-10">
                    <Briefcase size={12} />
                  </div>

                  {/* Spacer for desktop alignment */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Experience Card */}
                  <div className="md:w-1/2 md:px-8 pl-8 md:pl-0">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-300 relative hover:shadow-lg hover:border-sky-100"
                    >
                      {/* Period Badge */}
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-3xs font-semibold text-sky-600 font-mono mb-3">
                        <Calendar size={10} />
                        {exp.period}
                      </span>
                      
                      <h4 className="font-display text-lg font-bold text-slate-900 leading-snug">{exp.role}</h4>
                      <h5 className="font-semibold text-slate-500 text-xs mt-1">{exp.company}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-3 border-t border-slate-50 pt-3">
                        {exp.description}
                      </p>

                      {/* Tech Used Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-1">
                        {exp.tags.map(tag => (
                          <span key={tag} className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-3xs text-slate-500 font-semibold font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}