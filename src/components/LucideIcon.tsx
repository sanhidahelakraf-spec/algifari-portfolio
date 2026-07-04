import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size }: LucideIconProps) {
  // Safe lookup with fallback
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name];

  if (!IconComponent) {
    // Return a default icon like Code if not found
    const Fallback = Icons.Code;
    return <Fallback className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
