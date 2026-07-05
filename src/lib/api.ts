import { supabase } from './supabaseClient';
import { Project, Message, PortfolioConfig, Skill, Experience } from '../types';

// =========================================
// Mapping: baris database (snake_case) <-> tipe aplikasi (camelCase)
// =========================================

function mapConfigRow(row: any): PortfolioConfig {
  return {
    name: row.name,
    title: row.title,
    aboutText: row.about_text,
    availability: row.availability,
    resumeUrl: row.resume_url || undefined,
    email: row.email,
    phoneDisplay: row.phone_display,
    whatsappUrl: row.whatsapp_url,
    location: row.location,
    githubUrl: row.github_url || undefined,
    linkedinUrl: row.linkedin_url || undefined,
    instagramUrl: row.instagram_url || undefined,
    photoUrl: row.photo_url || undefined,
  };
}

function configToRow(config: PortfolioConfig) {
  return {
    name: config.name,
    title: config.title,
    about_text: config.aboutText,
    availability: config.availability,
    resume_url: config.resumeUrl || null,
    email: config.email,
    phone_display: config.phoneDisplay,
    whatsapp_url: config.whatsappUrl,
    location: config.location,
    github_url: config.githubUrl || null,
    linkedin_url: config.linkedinUrl || null,
    instagram_url: config.instagramUrl || null,
    photo_url: config.photoUrl || null,
  };
}

export function mapProjectRow(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    tags: row.tags || [],
    image: row.image,
    demoUrl: row.demo_url || undefined,
    githubUrl: row.github_url || undefined,
    featured: row.featured,
  };
}

function mapMessageRow(row: any): Message {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    timestamp: row.created_at,
    isRead: row.is_read,
  };
}

// =========================================
// CONFIG
// =========================================

export async function fetchConfig(): Promise<PortfolioConfig | null> {
  const { data, error } = await supabase.from('config').select('*').eq('id', 1).single();
  if (error) {
    console.error('Gagal mengambil config:', error.message);
    return null;
  }
  return mapConfigRow(data);
}

export async function updateConfig(config: PortfolioConfig): Promise<PortfolioConfig> {
  const { data, error } = await supabase
    .from('config')
    .update(configToRow(config))
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return mapConfigRow(data);
}

// =========================================
// PROJECTS
// =========================================

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Gagal mengambil projects:', error.message);
    return [];
  }
  return (data || []).map(mapProjectRow);
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      image: project.image,
      demo_url: project.demoUrl || null,
      github_url: project.githubUrl || null,
      featured: project.featured,
    })
    .select()
    .single();
  if (error) throw error;
  return mapProjectRow(data);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// =========================================
// MESSAGES
// =========================================

export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Gagal mengambil messages:', error.message);
    return [];
  }
  return (data || []).map(mapMessageRow);
}

export async function sendMessage(
  msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>
): Promise<void> {
  const { error } = await supabase.from('messages').insert({
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
  });
  if (error) throw error;
}

export async function updateMessageReadStatus(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase.from('messages').update({ is_read: isRead }).eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}

// =========================================
// SKILLS
// =========================================

function mapSkillRow(row: any): Skill {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    level: row.level,
    icon: row.icon,
  };
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Gagal mengambil skills:', error.message);
    return [];
  }
  return (data || []).map(mapSkillRow);
}

export async function addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .insert({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
    })
    .select()
    .single();
  if (error) throw error;
  return mapSkillRow(data);
}

export async function updateSkill(id: string, skill: Omit<Skill, 'id'>): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .update({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapSkillRow(data);
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

// =========================================
// EXPERIENCES
// =========================================

function mapExperienceRow(row: any): Experience {
  return {
    id: row.id,
    role: row.role,
    company: row.company,
    period: row.period,
    description: row.description,
    tags: row.tags || [],
  };
}

export async function fetchExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Gagal mengambil experiences:', error.message);
    return [];
  }
  return (data || []).map(mapExperienceRow);
}

export async function addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
  const { data, error } = await supabase
    .from('experiences')
    .insert({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      tags: exp.tags,
    })
    .select()
    .single();
  if (error) throw error;
  return mapExperienceRow(data);
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) throw error;
}