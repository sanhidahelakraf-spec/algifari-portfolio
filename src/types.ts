export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Design' | 'Others';
  level: number; // 0 - 100
  icon: string; // Lucide icon name
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface PortfolioConfig {
  name: string;
  title: string;
  aboutText: string;
  availability: 'Available' | 'Busy' | 'Freelance';
  resumeUrl?: string;
  photoUrl?: string;   // URL foto profil, ditampilkan di Hero section
  // Contact & social info (ditampilkan di section Contact publik)
  email: string;
  phoneDisplay: string;   // contoh: "+62 812-3456-789"
  whatsappUrl: string;    // contoh: "https://wa.me/628123456789"
  location: string;       // contoh: "Bandung, Jawa Barat, Indonesia"
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}