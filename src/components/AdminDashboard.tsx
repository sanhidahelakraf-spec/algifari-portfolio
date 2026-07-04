import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Message, PortfolioConfig } from '../types';
import {
  addProject as apiAddProject,
  deleteProject as apiDeleteProject,
  updateMessageReadStatus,
  deleteMessage as apiDeleteMessage,
  updateConfig as apiUpdateConfig,
} from '../lib/api';
import { 
  Plus, Trash2, Mail, MailOpen, AlertCircle, LayoutGrid, CheckCircle2, 
  Settings, FolderKanban, LogOut, Globe, Github, Sparkles, User, Briefcase,
  Phone, MapPin, Linkedin, Instagram
} from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  messages: Message[];
  config: PortfolioConfig;
  onLogout: () => void;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateMessages: (messages: Message[]) => void;
  onUpdateConfig: (config: PortfolioConfig) => void;
}

export default function AdminDashboard({
  projects,
  messages,
  config,
  onLogout,
  onUpdateProjects,
  onUpdateMessages,
  onUpdateConfig,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'projects' | 'profile'>('inbox');
  
  // States for adding a new project
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('Web App');
  const [newProjTags, setNewProjTags] = useState('');
  const [newProjImage, setNewProjImage] = useState('');
  const [newProjDemo, setNewProjDemo] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [projectSuccess, setProjectSuccess] = useState(false);

  // Profile Form States
  const [profileTitle, setProfileTitle] = useState(config.title);
  const [profileAbout, setProfileAbout] = useState(config.aboutText);
  const [profileAvailability, setProfileAvailability] = useState(config.availability);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Contact Form States
  const [profileEmail, setProfileEmail] = useState(config.email);
  const [profilePhoneDisplay, setProfilePhoneDisplay] = useState(config.phoneDisplay);
  const [profileWhatsappUrl, setProfileWhatsappUrl] = useState(config.whatsappUrl);
  const [profileLocation, setProfileLocation] = useState(config.location);
  const [profileGithubUrl, setProfileGithubUrl] = useState(config.githubUrl || '');
  const [profileLinkedinUrl, setProfileLinkedinUrl] = useState(config.linkedinUrl || '');
  const [profileInstagramUrl, setProfileInstagramUrl] = useState(config.instagramUrl || '');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(config.photoUrl || '');

  // Actions for Messages
  const handleToggleRead = async (id: string) => {
    const target = messages.find(msg => msg.id === id);
    if (!target) return;
    const newStatus = !target.isRead;
    try {
      await updateMessageReadStatus(id, newStatus);
      onUpdateMessages(messages.map(msg => (msg.id === id ? { ...msg, isRead: newStatus } : msg)));
    } catch (err) {
      console.error('Gagal memperbarui status pesan:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await apiDeleteMessage(id);
      onUpdateMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      console.error('Gagal menghapus pesan:', err);
    }
  };

  // Action for adding Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError('');
    setProjectSuccess(false);

    if (!newProjTitle.trim() || !newProjDesc.trim()) {
      setProjectError('Judul dan Deskripsi proyek wajib diisi.');
      return;
    }

    const tagsArray = newProjTags
      ? newProjTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : ['React', 'Tailwind'];

    const fallbackImage = newProjImage.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    try {
      const createdProject = await apiAddProject({
        title: newProjTitle.trim(),
        description: newProjDesc.trim(),
        category: newProjCategory,
        tags: tagsArray,
        image: fallbackImage,
        demoUrl: newProjDemo.trim() || undefined,
        githubUrl: newProjGithub.trim() || undefined,
        featured: true,
      });

      onUpdateProjects([createdProject, ...projects]);

      // Clear Form
      setNewProjTitle('');
      setNewProjDesc('');
      setNewProjTags('');
      setNewProjImage('');
      setNewProjDemo('');
      setNewProjGithub('');
      setIsAddingProject(false);
      setProjectSuccess(true);
      setTimeout(() => setProjectSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan proyek:', err);
      setProjectError('Gagal menyimpan proyek ke database. Silakan coba lagi.');
    }
  };

  // Action for deleting Project
  const handleDeleteProject = async (id: string) => {
    try {
      await apiDeleteProject(id);
      onUpdateProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Gagal menghapus proyek:', err);
    }
  };

  // Action for updating profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);

    const updatedConfig: PortfolioConfig = {
      ...config,
      title: profileTitle.trim(),
      aboutText: profileAbout.trim(),
      availability: profileAvailability,
      email: profileEmail.trim(),
      phoneDisplay: profilePhoneDisplay.trim(),
      whatsappUrl: profileWhatsappUrl.trim(),
      location: profileLocation.trim(),
      githubUrl: profileGithubUrl.trim() || undefined,
      linkedinUrl: profileLinkedinUrl.trim() || undefined,
      instagramUrl: profileInstagramUrl.trim() || undefined,
      photoUrl: profilePhotoUrl.trim() || undefined,
    };

    try {
      const saved = await apiUpdateConfig(updatedConfig);
      onUpdateConfig(saved);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan profil:', err);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Dashboard Banner Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400 p-8 shadow-lg text-white">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute left-1/3 bottom-0 h-24 w-24 translate-y-12 rounded-full bg-sky-300/20 blur-xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles size={12} className="animate-pulse" />
                Admin Workspace
              </span>
              <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                Halo, {config.name}!
              </h1>
              <p className="text-sky-100 max-w-xl text-sm leading-relaxed">
                Di sini Anda dapat memantau pesan masuk dari klien, mengelola daftar proyek portofolio, serta menyesuaikan bio profil Anda secara langsung.
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20 transition-all border border-white/20 active:scale-95"
            >
              <LogOut size={16} />
              <span>Keluar Workspace</span>
            </button>
          </div>
        </div>

        {/* Overview Cards (Bento metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
              <Mail size={20} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Total Pesan</span>
              <h3 className="text-2xl font-bold text-slate-800 font-display">
                {messages.length} <span className="text-xs font-normal text-slate-400">({unreadCount} belum dibaca)</span>
              </h3>
            </div>
          </div>
          
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              <FolderKanban size={20} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Total Proyek</span>
              <h3 className="text-2xl font-bold text-slate-800 font-display">{projects.length}</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Status Ketersediaan</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${config.availability === 'Available' ? 'bg-emerald-500' : config.availability === 'Freelance' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-semibold text-slate-700">{config.availability}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-bold transition-all ${
                activeTab === 'inbox' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 border border-slate-100'
              }`}
            >
              <Mail size={18} />
              <span>Inbox Pesan</span>
              {unreadCount > 0 && (
                <span className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-2xs font-extrabold ${activeTab === 'inbox' ? 'bg-white text-slate-900' : 'bg-red-500 text-white'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-bold transition-all ${
                activeTab === 'projects' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 border border-slate-100'
              }`}
            >
              <FolderKanban size={18} />
              <span>Daftar Proyek</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-bold transition-all ${
                activeTab === 'profile' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 border border-slate-100'
              }`}
            >
              <Settings size={18} />
              <span>Pengaturan Profil</span>
            </button>
          </div>

          {/* Active Panel Area */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <AnimatePresence mode="wait">
                
                {/* 1. INBOX PANEL */}
                {activeTab === 'inbox' && (
                  <motion.div
                    key="inbox"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-slate-900">Kotak Masuk Pesan</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Pesan yang dikirimkan oleh pengunjung melalui formulir kontak.</p>
                      </div>
                    </div>

                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                        <MailOpen size={44} className="mb-3 text-slate-300 stroke-1" />
                        <p className="text-sm font-medium">Kotak masuk masih kosong</p>
                        <p className="text-xs mt-1">Belum ada pesan dari pengunjung.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`rounded-xl border p-5 transition-all ${
                              msg.isRead 
                                ? 'bg-white border-slate-100 opacity-80' 
                                : 'bg-sky-50/20 border-sky-100 ring-1 ring-sky-100/30'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-display font-bold text-slate-800 text-sm">{msg.name}</h4>
                                  <span className="text-xs text-slate-400 font-mono">({msg.email})</span>
                                  {!msg.isRead && (
                                    <span className="rounded bg-sky-100 px-1.5 py-0.5 text-3xs font-extrabold uppercase tracking-wide text-sky-600">Baru</span>
                                  )}
                                </div>
                                <h5 className="font-semibold text-slate-700 text-xs mt-1">{msg.subject}</h5>
                              </div>
                              <span className="text-2xs text-slate-400 font-mono mt-0.5 sm:mt-0">
                                {new Date(msg.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 whitespace-pre-line border border-slate-100/60">
                              {msg.message}
                            </p>
                            <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100/60 pt-3 text-xs">
                              <button
                                onClick={() => handleToggleRead(msg.id)}
                                className="flex items-center gap-1 font-semibold text-slate-500 hover:text-sky-600 transition-colors"
                              >
                                {msg.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                                <span>{msg.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}</span>
                              </button>
                              <span className="h-3 w-px bg-slate-200" />
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="flex items-center gap-1 font-semibold text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. PROJECTS PANEL */}
                {activeTab === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                      <div>
                        <h2 className="font-display text-xl font-bold text-slate-900">Manajemen Proyek</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Tambah proyek baru atau hapus proyek dari halaman portofolio.</p>
                      </div>
                      <button
                        onClick={() => setIsAddingProject(!isAddingProject)}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-95"
                      >
                        <Plus size={16} />
                        <span>{isAddingProject ? 'Batal Tambah' : 'Tambah Proyek'}</span>
                      </button>
                    </div>

                    {projectSuccess && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>Proyek berhasil ditambahkan ke portofolio!</span>
                      </div>
                    )}

                    {/* Add Project Form Collapsible */}
                    {isAddingProject && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddProject}
                        className="rounded-xl border border-sky-100 bg-sky-50/10 p-5 space-y-4 overflow-hidden"
                      >
                        <h3 className="font-display font-bold text-slate-800 text-sm border-b border-sky-100/50 pb-2">Form Tambah Proyek</h3>
                        {projectError && (
                          <div className="flex items-center gap-2 rounded bg-red-50 p-2.5 text-xs text-red-600">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{projectError}</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Judul Proyek</label>
                            <input
                              type="text"
                              required
                              value={newProjTitle}
                              onChange={(e) => setNewProjTitle(e.target.value)}
                              placeholder="Contoh: AeroCloud Dashboard"
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Kategori</label>
                            <select
                              value={newProjCategory}
                              onChange={(e) => setNewProjCategory(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            >
                              <option value="Web App">Web App</option>
                              <option value="Mobile App">Mobile App</option>
                              <option value="Design">Design / UI/UX</option>
                              <option value="Library">Library / Tool</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Deskripsi Ringkas</label>
                          <textarea
                            required
                            rows={3}
                            value={newProjDesc}
                            onChange={(e) => setNewProjDesc(e.target.value)}
                            placeholder="Jelaskan mengenai proyek ini, teknologi yang digunakan, serta fitur utamanya..."
                            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Tags / Tech Stack (pisahkan dengan koma)</label>
                            <input
                              type="text"
                              value={newProjTags}
                              onChange={(e) => setNewProjTags(e.target.value)}
                              placeholder="React, TypeScript, Tailwind"
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">URL Gambar (opsional)</label>
                            <input
                              type="url"
                              value={newProjImage}
                              onChange={(e) => setNewProjImage(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Link Demo Live (opsional)</label>
                            <input
                              type="text"
                              value={newProjDemo}
                              onChange={(e) => setNewProjDemo(e.target.value)}
                              placeholder="https://my-demo.com"
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Link GitHub Repository (opsional)</label>
                            <input
                              type="text"
                              value={newProjGithub}
                              onChange={(e) => setNewProjGithub(e.target.value)}
                              placeholder="https://github.com/..."
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-sky-100/50 pt-3">
                          <button
                            type="button"
                            onClick={() => setIsAddingProject(false)}
                            className="rounded-full bg-slate-100 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition-colors"
                          >
                            Simpan Proyek
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Project List */}
                    <div className="space-y-3">
                      <h3 className="font-display font-bold text-slate-800 text-sm">Proyek Saat Ini ({projects.length})</h3>
                      <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white overflow-hidden">
                        {projects.map((proj) => (
                          <div key={proj.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors gap-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img 
                                src={proj.image} 
                                alt={proj.title} 
                                className="h-12 w-16 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="overflow-hidden">
                                <h4 className="font-display font-semibold text-slate-800 text-sm truncate">{proj.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <span className="rounded bg-sky-50 px-1.5 py-0.5 text-3xs font-semibold text-sky-600">{proj.category}</span>
                                  <span className="text-3xs text-slate-400 truncate">{proj.tags.slice(0, 3).join(', ')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {proj.demoUrl && (
                                <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                  <Globe size={14} />
                                </a>
                              )}
                              {proj.githubUrl && (
                                <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                  <Github size={14} />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Hapus Proyek"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. PROFILE SETTINGS PANEL */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900">Pengaturan Profil</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Sesuaikan teks bio naratif Anda, ketersediaan, dan judul pekerjaan.</p>
                    </div>

                    {profileSuccess && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>Profil berhasil diperbarui dan diselaraskan secara langsung!</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-4 border-t border-slate-100 pt-4">
                      <div>
                        <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Foto Profil (URL Gambar)</label>
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 h-20 w-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                            {profilePhotoUrl ? (
                              <img src={profilePhotoUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                              <User size={24} className="text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="url"
                              value={profilePhotoUrl}
                              onChange={(e) => setProfilePhotoUrl(e.target.value)}
                              placeholder="https://contoh.com/foto-saya.jpg"
                              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                            <span className="text-3xs text-slate-400 mt-1 block leading-relaxed">
                              Tempel link foto kamu di sini (upload dulu ke layanan seperti Imgur/Cloudinary, lalu salin link gambarnya). Kosongkan untuk memakai tampilan mockup default.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Nama Portofolio</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <User size={14} />
                          </span>
                          <input
                            type="text"
                            required
                            disabled
                            value="Algifari"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <span className="text-3xs text-slate-400 mt-1 block">Nama utama bersifat unik dan dikunci untuk portfolio ini.</span>
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Judul Pekerjaan / Subtitle</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <Briefcase size={14} />
                          </span>
                          <input
                            type="text"
                            required
                            value={profileTitle}
                            onChange={(e) => setProfileTitle(e.target.value)}
                            placeholder="Contoh: Full Stack Web Developer & UI/UX Specialist"
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Ketersediaan Kerja</label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['Available', 'Freelance', 'Busy'] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setProfileAvailability(status)}
                              className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition-all ${
                                profileAvailability === status
                                  ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-500/20'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`h-2 w-2 rounded-full ${status === 'Available' ? 'bg-emerald-500' : status === 'Freelance' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                              <span>{status}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Naratif Bio (Deskripsi Tentang Saya)</label>
                        <textarea
                          required
                          rows={5}
                          value={profileAbout}
                          onChange={(e) => setProfileAbout(e.target.value)}
                          placeholder="Jelaskan mengenai keahlian Anda, semangat, dan tujuan kerja Anda..."
                          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 leading-relaxed focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        />
                      </div>

                      {/* --- Info Kontak Publik --- */}
                      <div className="border-t border-slate-100 pt-5 mt-2">
                        <h3 className="font-display text-sm font-bold text-slate-900">Informasi Kontak</h3>
                        <p className="text-3xs text-slate-500 mt-0.5 mb-4">Data ini akan tampil di section "Hubungi Saya" pada halaman publik.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Email</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Mail size={14} />
                              </span>
                              <input
                                type="email"
                                required
                                value={profileEmail}
                                onChange={(e) => setProfileEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Nomor Telepon (tampilan)</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Phone size={14} />
                              </span>
                              <input
                                type="text"
                                required
                                value={profilePhoneDisplay}
                                onChange={(e) => setProfilePhoneDisplay(e.target.value)}
                                placeholder="+62 812-3456-789"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Link WhatsApp</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <Phone size={14} />
                            </span>
                            <input
                              type="url"
                              required
                              value={profileWhatsappUrl}
                              onChange={(e) => setProfileWhatsappUrl(e.target.value)}
                              placeholder="https://wa.me/628123456789"
                              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                          <span className="text-3xs text-slate-400 mt-1 block">Format: https://wa.me/62xxxxxxxxxx (nomor tanpa tanda + atau 0 di depan, awali dengan 62).</span>
                        </div>

                        <div className="mt-4">
                          <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Lokasi</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <MapPin size={14} />
                            </span>
                            <input
                              type="text"
                              required
                              value={profileLocation}
                              onChange={(e) => setProfileLocation(e.target.value)}
                              placeholder="Kota, Provinsi, Negara"
                              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* --- Sosial Media (opsional) --- */}
                      <div className="border-t border-slate-100 pt-5 mt-2">
                        <h3 className="font-display text-sm font-bold text-slate-900">Sosial Media (Opsional)</h3>
                        <p className="text-3xs text-slate-500 mt-0.5 mb-4">Kosongkan jika tidak ingin ditampilkan. Ikon hanya muncul di halaman publik jika linknya diisi.</p>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">GitHub URL</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Github size={14} />
                              </span>
                              <input
                                type="url"
                                value={profileGithubUrl}
                                onChange={(e) => setProfileGithubUrl(e.target.value)}
                                placeholder="https://github.com/username"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">LinkedIn URL</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Linkedin size={14} />
                              </span>
                              <input
                                type="url"
                                value={profileLinkedinUrl}
                                onChange={(e) => setProfileLinkedinUrl(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Instagram URL</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Instagram size={14} />
                              </span>
                              <input
                                type="url"
                                value={profileInstagramUrl}
                                onChange={(e) => setProfileInstagramUrl(e.target.value)}
                                placeholder="https://instagram.com/username"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          type="submit"
                          className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}