import { Project, Skill, Experience, PortfolioConfig, Message } from './types';

export const INITIAL_CONFIG: PortfolioConfig = {
  name: 'Algifari',
  title: 'Full Stack Web Developer & UI/UX Designer',
  aboutText: 'Saya adalah seorang Full Stack Web Developer yang berfokus pada pembuatan aplikasi web interaktif, berkinerja tinggi, dan ramah pengguna. Dengan latar belakang desain UI/UX, saya menggabungkan kode yang bersih dengan estetika visual yang modern untuk menciptakan pengalaman digital yang luar biasa.',
  availability: 'Available',
  email: 'algifari@example.com',
  phoneDisplay: '+62 812-3456-789',
  whatsappUrl: 'https://wa.me/628123456789',
  location: 'Bandung, Jawa Barat, Indonesia',
  githubUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  photoUrl: '',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SkyFinance - Smart Financial Dashboard',
    description: 'Aplikasi dashboard keuangan modern dengan visualisasi data real-time, manajemen anggaran otomatis, dan analisis pengeluaran bertenaga AI. Didesain dengan warna biru muda yang memukau.',
    category: 'Web App',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'NexaTask - Collaborative Project Planner',
    description: 'Sistem manajemen proyek kolaboratif bergaya bento grid yang dilengkapi dengan diagram gantt interaktif, board kanban dinamis, dan sistem obrolan tim terintegrasi.',
    category: 'Web App',
    tags: ['Next.js', 'Express', 'Socket.io', 'Tailwind CSS', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: '3',
    title: 'BreezeUI - Modern Figma Design System',
    description: 'Sebuah sistem desain minimalis, bersih, dan konsisten dengan komponen modular bervariasi warna biru muda yang dioptimalkan untuk pengembangan produk digital skala besar.',
    category: 'Design',
    tags: ['Figma', 'UI/UX', 'Design System', 'Bento Layout'],
    image: 'https://images.unsplash.com/photo-1541462608141-ad4979e408c9?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    featured: false,
  },
  {
    id: '4',
    title: 'ZenSpace - Mindfulness & Productivity App',
    description: 'Aplikasi seluler pendukung fokus yang menggabungkan meditasi terbimbing, pelacak kebiasaan harian, dan ambient generator beranimasi riak air yang menenangkan.',
    category: 'Mobile App',
    tags: ['React Native', 'Expo', 'Redux Toolkit', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
  },
  {
    id: '5',
    title: 'AeroCloud - Devops Monitor & Analytics',
    description: 'Platform analitik untuk memantau performa server cloud dengan visualisasi konsumsi sumber daya waktu-nyata dan sistem notifikasi instan berbasis Webhook.',
    category: 'Web App',
    tags: ['Vue 3', 'Node.js', 'Tailwind CSS', 'D3.js', 'Redis'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
  }
];

export const INITIAL_SKILLS: Skill[] = [
  // Frontend
  { name: 'React / Next.js', category: 'Frontend', level: 92, icon: 'Code' },
  { name: 'TypeScript', category: 'Frontend', level: 88, icon: 'FileCode' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 95, icon: 'Layers' },
  { name: 'Framer Motion', category: 'Frontend', level: 85, icon: 'Zap' },
  
  // Backend
  { name: 'Node.js / Express', category: 'Backend', level: 86, icon: 'Server' },
  { name: 'PostgreSQL & MongoDB', category: 'Backend', level: 80, icon: 'Database' },
  { name: 'GraphQL / REST API', category: 'Backend', level: 88, icon: 'Cpu' },
  
  // Design & Others
  { name: 'UI/UX Design (Figma)', category: 'Design', level: 90, icon: 'Figma' },
  { name: 'Git & GitHub', category: 'Others', level: 92, icon: 'GitBranch' },
  { name: 'Docker & CI/CD', category: 'Others', level: 75, icon: 'Cloud' }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: '1',
    role: 'Senior Full Stack Engineer',
    company: 'NexaDigital Tech',
    period: '2024 - Sekarang',
    description: 'Memimpin tim pengembang beranggotakan 5 orang untuk merancang dan membangun platform e-commerce skala besar yang meningkatkan retensi pengguna sebesar 35%. Mengoptimalkan waktu muat halaman menggunakan React Server Components dan CDN caching.',
    tags: ['React', 'Node.js', 'GraphQL', 'AWS', 'Team Leadership'],
  },
  {
    id: '2',
    role: 'UI/UX Engineer',
    company: 'Veloce Creative Agency',
    period: '2022 - 2024',
    description: 'Menjembatani celah antara desainer grafis dan tim engineering dengan membangun pustaka komponen React berbasis Tailwind CSS. Mengurangi waktu iterasi desain ke kode hingga 50%.',
    tags: ['Figma', 'React', 'Tailwind CSS', 'Framer Motion', 'Storybook'],
  },
  {
    id: '3',
    role: 'Frontend Web Developer',
    company: 'Solusi Teknologi Nusantara',
    period: '2020 - 2022',
    description: 'Mengembangkan aplikasi web responsif dan ramah SEO untuk berbagai klien korporat. Mengintegrasikan API eksternal pihak ketiga (sistem pembayaran, analitik) dan mengelola optimasi kinerja Core Web Vitals.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'REST API'],
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    name: 'Budi Santoso',
    email: 'budi@company.com',
    subject: 'Penawaran Kolaborasi Proyek',
    message: 'Halo Algifari, saya melihat portofolio Anda dan sangat tertarik dengan kualitas desain UI serta integrasi frontend yang Anda buat. Kami sedang mencari freelancer untuk membangun ulang aplikasi dashboard kami. Apakah Anda tersedia bulan ini?',
    timestamp: '2026-07-02T10:30:00.000Z',
    isRead: false,
  },
  {
    id: 'msg_2',
    name: 'Siti Rahma',
    email: 'siti.rahma@startup.co.id',
    subject: 'Undangan Wawancara - Senior Frontend Developer',
    message: 'Halo Algifari, kami sangat terkesan dengan rekam jejak Anda di NexaDigital Tech. Kami ingin mengundang Anda untuk mengobrol santai mengenai posisi Senior Frontend di startup kami yang bergerak di bidang fintech. Mohon informasikan ketersediaan waktu Anda.',
    timestamp: '2026-07-03T14:15:00.000Z',
    isRead: true,
  }
];