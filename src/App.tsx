import React, { useState, useEffect } from 'react';
import { INITIAL_CONFIG } from './data';
import { Project, Message, PortfolioConfig, Skill, Experience } from './types';
import { supabase } from './lib/supabaseClient';
import {
  fetchConfig,
  fetchProjects,
  fetchMessages,
  fetchSkills,
  fetchExperiences,
  sendMessage as apiSendMessage,
  mapProjectRow,
} from './lib/api';

// Component imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';

// Lucide icon imports
import { Heart, Copyright, Code, ArrowUp } from 'lucide-react';

export default function App() {
  // --- Data States (sumber: Supabase) ---
  const [config, setConfig] = useState<PortfolioConfig>(INITIAL_CONFIG);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoadingPublicData, setIsLoadingPublicData] = useState(true);

  // --- Auth State (sumber: Supabase Auth session) ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // --- UI/UX Flow States ---
  const [viewMode, setViewMode] = useState<'portfolio' | 'admin'>('portfolio');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- Load data publik (config & projects) sekali saat pertama render ---
  useEffect(() => {
    (async () => {
      const [configData, projectsData, skillsData, experiencesData] = await Promise.all([
        fetchConfig(),
        fetchProjects(),
        fetchSkills(),
        fetchExperiences(),
      ]);
      if (configData) setConfig(configData);
      setProjects(projectsData);
      setSkills(skillsData);
      setExperiences(experiencesData);
      setIsLoadingPublicData(false);
    })();
  }, []);

  // --- Pantau status login (Supabase Auth session) ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
      if (!session) setViewMode('portfolio');
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Ambil pesan hanya setelah admin login (RLS memblokir akses anonim) ---
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchMessages().then(setMessages);
    }
  }, [isAdminLoggedIn]);

  // --- Realtime: dengarkan perubahan tabel projects supaya web publik
  //     otomatis update tanpa refresh saat admin menambah/menghapus proyek ---
  useEffect(() => {
    const channel = supabase
      .channel('public-projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProject = mapProjectRow(payload.new);
            setProjects((prev) =>
              prev.some((p) => p.id === newProject.id) ? prev : [newProject, ...prev]
            );
          } else if (payload.eventType === 'UPDATE') {
            const updatedProject = mapProjectRow(payload.new);
            setProjects((prev) =>
              prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            setProjects((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Track window scroll for "Scroll To Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Action Handlers ---
  const handleSendMessage = async (newMsgData: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    await apiSendMessage(newMsgData);
  };

  const handleLoginSuccess = () => {
    setViewMode('admin');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewMode('portfolio');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoadingPublicData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <span className="text-xs font-medium">Memuat portofolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-sky-500/20">
      
      {/* Sticky Header Navbar */}
      <Navbar
        config={config}
        isAdminLoggedIn={isAdminLoggedIn}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Switcher */}
      <main>
        {viewMode === 'admin' && isAdminLoggedIn ? (
          <AdminDashboard
            projects={projects}
            messages={messages}
            config={config}
            skills={skills}
            experiences={experiences}
            onLogout={handleLogout}
            onUpdateProjects={setProjects}
            onUpdateMessages={setMessages}
            onUpdateConfig={setConfig}
            onUpdateSkills={setSkills}
            onUpdateExperiences={setExperiences}
          />
        ) : (
          <>
            {/* 1. HERO SECTION */}
            <Hero config={config} projectsCount={projects.length} />

            {/* 2. ABOUT & EXPERIENCE SECTION */}
            <About 
              config={config} 
              skills={skills} 
              experiences={experiences} 
            />

            {/* 3. PROJECTS SHOWCASE SECTION */}
            <Projects projects={projects} />

            {/* 4. CONTACT SECTION */}
            <Contact config={config} onSendMessage={handleSendMessage} />

            {/* Aesthetic Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
              <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-display font-black text-xs">
                      {config.name
                        .trim()
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="font-display text-base font-bold text-white tracking-tight">
                      {config.name}<span className="text-sky-400 font-bold">.</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Membangun jembatan interaktif antara ide kreatif dan kode fungsional yang kuat.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 text-xs font-semibold">
                  <a href="#about" className="hover:text-sky-400 transition-colors">Tentang</a>
                  <a href="#skills" className="hover:text-sky-400 transition-colors">Keahlian</a>
                  <a href="#projects" className="hover:text-sky-400 transition-colors">Proyek</a>
                  <a href="#contact" className="hover:text-sky-400 transition-colors">Hubungi</a>
                </div>

                <div className="text-xs text-slate-500 space-y-1 md:text-right">
                  <p className="flex items-center justify-center md:justify-end gap-1 font-mono text-[11px]">
                    <Code size={12} className="text-sky-400" /> Crafted with
                    <Heart size={10} className="text-red-400 fill-current animate-pulse" />
                    by {config.name}
                  </p>
                  <p className="flex items-center justify-center md:justify-end gap-1">
                    <Copyright size={11} /> {new Date().getFullYear()} {config.name}. All rights reserved.
                  </p>
                </div>

              </div>
            </footer>
          </>
        )}
      </main>

      {/* Admin Login Modal Panel */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating Scroll to Top Action Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          aria-label="Kembali ke Atas"
        >
          <ArrowUp size={16} />
        </button>
      )}

    </div>
  );
}