import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { Sparkles, Globe, Github, ExternalLink } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  return (
    <section id="projects" className="relative bg-white py-24 scroll-mt-16">
      
      {/* Visual background accents */}
      <div className="absolute left-10 top-1/3 pointer-events-none h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="absolute right-10 bottom-1/3 pointer-events-none h-48 w-48 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:flex md:items-end md:justify-between md:text-left gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/60 px-3.5 py-1.5 text-xs font-semibold text-sky-700 uppercase tracking-wider font-mono">
              <Sparkles size={12} className="text-sky-500" />
              Proyek Portofolio
            </span>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Karya Kreatif <span className="text-sky-500">&amp; Rekayasa Kode</span>
            </h2>
            <p className="mt-3.5 text-sm text-slate-500 leading-relaxed">
              Jelajahi pilihan aplikasi web fungsional, aplikasi seluler, dan sistem desain buatan saya sendiri.
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-1.5 justify-center md:justify-end shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  filter === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'Semua Proyek' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid layout with AnimatePresence */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((proj) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={proj.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md hover:shadow-xl hover:border-sky-100 transition-all duration-300"
              >
                
                {/* Project Image Wrapper with Zoom & overlay effects */}
                <div className="relative aspect-video overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Floating Category Badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-sm border border-slate-100 px-3 py-1 text-3xs font-extrabold uppercase tracking-wider text-sky-600 shadow-sm">
                    {proj.category}
                  </span>
                </div>

                {/* Project Body */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-sky-500 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Tech stack and Action buttons */}
                  <div className="mt-5 space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags.map(tag => (
                        <span key={tag} className="rounded bg-slate-50 border border-slate-100/50 px-2 py-0.5 text-3xs text-slate-500 font-semibold font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-3xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                        >
                          <Globe size={12} />
                          <span>Demo Live</span>
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-3xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          <Github size={12} />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>

              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <p className="text-sm font-semibold">Tidak ada proyek ditemukan dalam kategori ini.</p>
          </div>
        )}

      </div>
    </section>
  );
}