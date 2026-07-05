import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Message, PortfolioConfig, Skill, Experience } from '../types';
import {
  addProject as apiAddProject,
  deleteProject as apiDeleteProject,
  updateMessageReadStatus,
  deleteMessage as apiDeleteMessage,
  updateConfig as apiUpdateConfig,
  addSkill as apiAddSkill,
  deleteSkill as apiDeleteSkill,
  addExperience as apiAddExperience,
  deleteExperience as apiDeleteExperience,
} from '../lib/api';
import { 
  Plus, Trash2, Mail, MailOpen, AlertCircle, LayoutGrid, CheckCircle2, 
  Settings, FolderKanban, LogOut, Globe, Github, Sparkles, User, Briefcase,
  Phone, MapPin, Linkedin, Instagram, GraduationCap
} from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  messages: Message[];
  config: PortfolioConfig;
  skills: Skill[];
  experiences: Experience[];
  onLogout: () => void;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateMessages: (messages: Message[]) => void;
  onUpdateConfig: (config: PortfolioConfig) => void;
  onUpdateSkills: (skills: Skill[]) => void;
  onUpdateExperiences: (experiences: Experience[]) => void;
}

export default function AdminDashboard({
  projects,
  messages,
  config,
  skills,
  experiences,
  onLogout,
  onUpdateProjects,
  onUpdateMessages,
  onUpdateConfig,
  onUpdateSkills,
  onUpdateExperiences,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'projects' | 'career' | 'profile'>('inbox');

  // States for adding a new skill
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'Frontend' | 'Backend' | 'Design' | 'Others'>('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [newSkillIcon, setNewSkillIcon] = useState('Code');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState('');

  // States for adding a new experience
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpTags, setNewExpTags] = useState('');
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [experienceError, setExperienceError] = useState('');
  
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
  const [profileName, setProfileName] = useState(config.name);
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

  // Actions for Skills
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSkillError('');

    if (!newSkillName.trim()) {
      setSkillError('Nama keahlian wajib diisi.');
      return;
    }

    try {
      const created = await apiAddSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
        level: newSkillLevel,
        icon: newSkillIcon.trim() || 'Code',
      });
      onUpdateSkills([...skills, created]);
      setNewSkillName('');
      setNewSkillCategory('Frontend');
      setNewSkillLevel(80);
      setNewSkillIcon('Code');
      setIsAddingSkill(false);
    } catch (err) {
      console.error('Gagal menyimpan skill:', err);
      setSkillError('Gagal menyimpan keahlian ke database.');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await apiDeleteSkill(id);
      onUpdateSkills(skills.filter(s => s.id !== id));
    } catch (err) {
      console.error('Gagal menghapus skill:', err);
    }
  };

  // Actions for Experiences
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setExperienceError('');

    if (!newExpRole.trim() || !newExpCompany.trim() || !newExpPeriod.trim()) {
      setExperienceError('Posisi, Perusahaan, dan Periode wajib diisi.');
      return;
    }

    const tagsArray = newExpTags
      ? newExpTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    try {
      const created = await apiAddExperience({
        role: newExpRole.trim(),
        company: newExpCompany.trim(),
        period: newExpPeriod.trim(),
        description: newExpDesc.trim(),
        tags: tagsArray,
      });
      onUpdateExperiences([created, ...experiences]);
      setNewExpRole('');
      setNewExpCompany('');
      setNewExpPeriod('');
      setNewExpDesc('');
      setNewExpTags('');
      setIsAddingExperience(false);
    } catch (err) {
      console.error('Gagal menyimpan pengalaman kerja:', err);
      setExperienceError('Gagal menyimpan pengalaman kerja ke database.');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await apiDeleteExperience(id);
      onUpdateExperiences(experiences.filter(exp => exp.id !== id));
    } catch (err) {
      console.error('Gagal menghapus pengalaman kerja:', err);
    }
  };

  // Action for updating profile
  // States untuk popup konfirmasi simpan profil
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<PortfolioConfig | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);

    const updatedConfig: PortfolioConfig = {
      ...config,
      name: profileName.trim(),
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

    setPendingConfig(updatedConfig);
    setShowConfirmSaveModal(true);
  };

  const confirmSaveProfile = async () => {
    if (!pendingConfig) return;
    setIsSavingProfile(true);
    try {
      const saved = await apiUpdateConfig(pendingConfig);
      onUpdateConfig(saved);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan profil:', err);
    } finally {
      setIsSavingProfile(false);
      setShowConfirmSaveModal(false);
      setPendingConfig(null);
    }
  };

  const cancelSaveProfile = () => {
    setShowConfirmSaveModal(false);
    setPendingConfig(null);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans">

      {/* Toast Notifikasi Mengambang (selalu terlihat, tidak peduli posisi scroll) */}
      <AnimatePresence>
        {profileSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[100] flex items-center gap-2.5 rounded-xl bg-slate-900 px-5 py-3.5 text-sm text-white shadow-2xl shadow-slate-900/20"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="font-semibold">Profil berhasil diperbarui!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Simpan Profil */}
      <AnimatePresence>
        {showConfirmSaveModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelSaveProfile}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <Settings size={22} />
              </div>
              <h3 className="text-center font-display text-lg font-bold text-slate-900">
                Simpan Perubahan Profil?
              </h3>
              <p className="mt-1.5 text-center text-xs text-slate-500 leading-relaxed">
                Perubahan akan langsung tampil di halaman portofolio publik setelah disimpan.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={cancelSaveProfile}
                  disabled={isSavingProfile}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmSaveProfile}
                  disabled={isSavingProfile}
                  className="flex-1 rounded-full bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSavingProfile ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Ya, Simpan</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              onClick={() => setActiveTab('career')}
              className={`w-full flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-bold transition-all ${
                activeTab === 'career' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 border border-slate-100'
              }`}
            >
              <GraduationCap size={18} />
              <span>Karier & Keahlian</span>
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

                {/* 3. CAREER & SKILLS PANEL */}
                {activeTab === 'career' && (
                  <motion.div
                    key="career"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* --- KEAHLIAN TEKNIS (SKILLS) --- */}
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <h2 className="font-display text-xl font-bold text-slate-900">Keahlian Teknis</h2>
                          <p className="text-xs text-slate-500 mt-1">Kelola daftar skill beserta persentase penguasaan.</p>
                        </div>
                        <button
                          onClick={() => setIsAddingSkill(!isAddingSkill)}
                          className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
                        >
                          <Plus size={14} />
                          <span>Tambah Skill</span>
                        </button>
                      </div>

                      <AnimatePresence>
                        {isAddingSkill && (
                          <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleAddSkill}
                            className="overflow-hidden mb-6"
                          >
                            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-4">
                              {skillError && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                                  <AlertCircle size={14} className="shrink-0" />
                                  <span>{skillError}</span>
                                </div>
                              )}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Nama Skill</label>
                                  <input
                                    type="text"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    placeholder="Contoh: Vue.js"
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Kategori</label>
                                  <select
                                    value={newSkillCategory}
                                    onChange={(e) => setNewSkillCategory(e.target.value as any)}
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                  >
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Design">Design</option>
                                    <option value="Others">Others</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">
                                  Tingkat Penguasaan: {newSkillLevel}%
                                </label>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={newSkillLevel}
                                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                                  className="w-full accent-sky-500"
                                />
                              </div>
                              <div>
                                <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Nama Icon (Lucide, opsional)</label>
                                <input
                                  type="text"
                                  value={newSkillIcon}
                                  onChange={(e) => setNewSkillIcon(e.target.value)}
                                  placeholder="Contoh: Code, Server, Figma"
                                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                />
                                <span className="text-3xs text-slate-400 mt-1 block">
                                  Lihat nama-nama icon di lucide.dev/icons. Kosongkan untuk default.
                                </span>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsAddingSkill(false)}
                                  className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                                >
                                  Simpan Skill
                                </button>
                              </div>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      <div className="space-y-3">
                        {skills.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-6">Belum ada skill ditambahkan.</p>
                        )}
                        {skills.map((skill) => (
                          <div key={skill.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-bold text-slate-800 truncate">{skill.name}</span>
                                <span className="text-2xs font-bold text-sky-600 shrink-0 ml-2">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                              <span className="text-3xs text-slate-400 uppercase font-bold tracking-wider mt-1 block">
                                {skill.category}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="shrink-0 rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Hapus Skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* --- PENGALAMAN KERJA (EXPERIENCE) --- */}
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <h2 className="font-display text-xl font-bold text-slate-900">Perjalanan Karir</h2>
                          <p className="text-xs text-slate-500 mt-1">Tambah pekerjaan baru atau hapus yang kurang relevan.</p>
                        </div>
                        <button
                          onClick={() => setIsAddingExperience(!isAddingExperience)}
                          className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
                        >
                          <Plus size={14} />
                          <span>Tambah Pengalaman</span>
                        </button>
                      </div>

                      <AnimatePresence>
                        {isAddingExperience && (
                          <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleAddExperience}
                            className="overflow-hidden mb-6"
                          >
                            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-4">
                              {experienceError && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                                  <AlertCircle size={14} className="shrink-0" />
                                  <span>{experienceError}</span>
                                </div>
                              )}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Posisi / Jabatan</label>
                                  <input
                                    type="text"
                                    value={newExpRole}
                                    onChange={(e) => setNewExpRole(e.target.value)}
                                    placeholder="Contoh: Frontend Developer"
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Perusahaan</label>
                                  <input
                                    type="text"
                                    value={newExpCompany}
                                    onChange={(e) => setNewExpCompany(e.target.value)}
                                    placeholder="Contoh: PT Teknologi Maju"
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Periode</label>
                                <input
                                  type="text"
                                  value={newExpPeriod}
                                  onChange={(e) => setNewExpPeriod(e.target.value)}
                                  placeholder="Contoh: 2024 - Sekarang"
                                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                />
                              </div>
                              <div>
                                <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Deskripsi Pekerjaan</label>
                                <textarea
                                  rows={3}
                                  value={newExpDesc}
                                  onChange={(e) => setNewExpDesc(e.target.value)}
                                  placeholder="Jelaskan singkat tanggung jawab dan pencapaian kamu..."
                                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 leading-relaxed"
                                />
                              </div>
                              <div>
                                <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Tags/Skill (pisahkan dengan koma)</label>
                                <input
                                  type="text"
                                  value={newExpTags}
                                  onChange={(e) => setNewExpTags(e.target.value)}
                                  placeholder="React, Node.js, AWS"
                                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsAddingExperience(false)}
                                  className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                                >
                                  Simpan Pengalaman
                                </button>
                              </div>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      <div className="space-y-3">
                        {experiences.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-6">Belum ada pengalaman kerja ditambahkan.</p>
                        )}
                        {experiences.map((exp) => (
                          <div key={exp.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-800">{exp.role}</h3>
                              <p className="text-xs text-slate-500">{exp.company} &middot; {exp.period}</p>
                              {exp.description && (
                                <p className="text-2xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{exp.description}</p>
                              )}
                              {exp.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {exp.tags.map((tag) => (
                                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-3xs font-bold text-slate-500">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="shrink-0 rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Hapus Pengalaman"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. PROFILE SETTINGS PANEL */}
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
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Nama kamu"
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                          />
                        </div>
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