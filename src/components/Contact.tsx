import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Message, PortfolioConfig } from '../types';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Phone, MessageSquare, Github, Linkedin, Instagram } from 'lucide-react';

interface ContactProps {
  config: PortfolioConfig;
  onSendMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
}

export default function Contact({ config, onSendMessage }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Mohon lengkapi semua bidang formulir.');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      try {
        onSendMessage({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        });
        
        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Clear fields
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');

        // Reset success banner after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } catch (err) {
        setIsSubmitting(false);
        setError('Gagal mengirim pesan. Silakan coba kembali.');
      }
    }, 1200);
  };

  return (
    <section id="contact" className="relative bg-slate-50 py-24 scroll-mt-16">
      
      {/* Background graphic details */}
      <div className="absolute right-0 top-1/3 pointer-events-none h-72 w-72 rounded-full bg-sky-200/10 blur-3xl" />
      <div className="absolute left-10 bottom-10 pointer-events-none h-64 w-64 rounded-full bg-indigo-200/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/60 px-3.5 py-1.5 text-xs font-semibold text-sky-700 uppercase tracking-wider font-mono">
            <Sparkles size={12} className="text-sky-500" />
            Hubungi Saya
          </span>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Mari Berkolaborasi <span className="text-sky-500">Membangun Ide Anda</span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-xl text-sm text-slate-500 leading-relaxed">
            Apakah Anda memiliki proyek menarik, tawaran pekerjaan, atau hanya sekadar ingin menyapa? Kirim pesan Anda sekarang!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Details (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-xl flex-1 flex flex-col justify-between">
              
              <div className="space-y-6">
                <h3 className="font-display text-2xl font-bold text-slate-900">Hubungi Secara Langsung</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Saya selalu menyambut baik diskusi seputar proyek kreatif baru, kolaborasi tim, atau konsultasi ide teknis Anda.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 border border-sky-100/35">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">Kirim Email</span>
                      <a href={`mailto:${config.email}`} className="text-sm font-bold text-slate-800 hover:text-sky-500 transition-colors block">
                        {config.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 border border-indigo-100/35">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">Telepon / WhatsApp</span>
                      <a href={config.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-800 hover:text-indigo-500 transition-colors block">
                        {config.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100/35">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">Lokasi Saat Ini</span>
                      <span className="text-sm font-bold text-slate-800 block">
                        {config.location}
                      </span>
                    </div>
                  </div>

                  {(config.githubUrl || config.linkedinUrl || config.instagramUrl) && (
                    <div className="flex items-center gap-3 pt-2">
                      {config.githubUrl && (
                        <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors">
                          <Github size={16} />
                        </a>
                      )}
                      {config.linkedinUrl && (
                        <a href={config.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600 hover:bg-sky-600 hover:text-white transition-colors">
                          <Linkedin size={16} />
                        </a>
                      )}
                      {config.instagramUrl && (
                        <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600 hover:bg-pink-600 hover:text-white transition-colors">
                          <Instagram size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Minimalist Map Placeholder Card */}
              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Tersedia untuk meeting luring & daring</span>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form (7 columns) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-sky-500" />
                <span>Formulir Pesan Cepat</span>
              </h3>

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-2.5 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-100"
                >
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Pesan Terkirim dengan Sukses!</span>
                    <span className="mt-0.5 block leading-relaxed text-slate-600">
                      Terima kasih atas pesan Anda. Pesan telah diteruskan langsung ke Workspace Admin Algifari dan akan segera dibalas melalui email.
                    </span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-100">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Alamat Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@domain.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Subjek / Topik</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Diskusi Proyek Baru / Kerjasama Bisnis"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-600 uppercase mb-1">Isi Pesan Anda</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis pesan Anda secara detail di sini..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 transition-all focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}