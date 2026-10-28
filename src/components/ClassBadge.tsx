import React from 'react';
import { 
  Sparkles, 
  Shield, 
  Sword, 
  Flame, 
  Feather, 
  Sun, 
  Leaf, 
  Music, 
  Eye, 
  Zap, 
  Skull, 
  Hammer,
  Compass
} from 'lucide-react';

interface ClassBadgeProps {
  classNameStr: string;
  size?: 'sm' | 'md' | 'lg';
}

export const getClassTheme = (classNameStr: string) => {
  const normalized = (classNameStr || '').toLowerCase();

  if (normalized.includes('mage') || normalized.includes('wizard') || normalized.includes('sorcerer')) {
    return {
      name: 'Mage',
      icon: Sparkles,
      color: 'from-violet-700 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-amber-500/20',
      badgeBg: 'bg-[#21121d]',
      accent: '#a855f7',
      tag: 'Arcane Transmuter'
    };
  }

  if (normalized.includes('rogue') || normalized.includes('assassin') || normalized.includes('thief')) {
    return {
      name: 'Rogue',
      icon: Feather,
      color: 'from-emerald-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-emerald-500/20',
      badgeBg: 'bg-[#101d16]',
      accent: '#10b981',
      tag: 'Shadow Infiltrator'
    };
  }

  if (normalized.includes('warrior') || normalized.includes('fighter') || normalized.includes('berserker') || normalized.includes('barbarian')) {
    return {
      name: 'Warrior',
      icon: Sword,
      color: 'from-red-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-red-500/20',
      badgeBg: 'bg-[#220d0d]',
      accent: '#ef4444',
      tag: 'Master of Arms'
    };
  }

  if (normalized.includes('paladin') || normalized.includes('crusader') || normalized.includes('templar')) {
    return {
      name: 'Paladin',
      icon: Sun,
      color: 'from-amber-600 to-yellow-800',
      textColor: 'text-amber-100',
      borderColor: 'border-amber-500',
      glowColor: 'shadow-amber-500/40',
      badgeBg: 'bg-[#27190b]',
      accent: '#f59e0b',
      tag: 'Solar Champion'
    };
  }

  if (normalized.includes('ranger') || normalized.includes('hunter') || normalized.includes('scout')) {
    return {
      name: 'Ranger',
      icon: Compass,
      color: 'from-lime-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-lime-500/20',
      badgeBg: 'bg-[#181f0d]',
      accent: '#84cc16',
      tag: 'Wilderness Warden'
    };
  }

  if (normalized.includes('cleric') || normalized.includes('priest')) {
    return {
      name: 'Cleric',
      icon: Shield,
      color: 'from-sky-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-sky-500/20',
      badgeBg: 'bg-[#0f1d26]',
      accent: '#0ea5e9',
      tag: 'Divine Healer'
    };
  }

  if (normalized.includes('druid')) {
    return {
      name: 'Druid',
      icon: Leaf,
      color: 'from-green-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-green-500/20',
      badgeBg: 'bg-[#0d2112]',
      accent: '#22c55e',
      tag: 'Primeval Shifter'
    };
  }

  if (normalized.includes('bard')) {
    return {
      name: 'Bard',
      icon: Music,
      color: 'from-fuchsia-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-fuchsia-500/20',
      badgeBg: 'bg-[#220d1c]',
      accent: '#d946ef',
      tag: 'Lyric Weaver'
    };
  }

  if (normalized.includes('warlock')) {
    return {
      name: 'Warlock',
      icon: Eye,
      color: 'from-purple-900 to-stone-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-purple-500/20',
      badgeBg: 'bg-[#1a0d24]',
      accent: '#a855f7',
      tag: 'Eldritch Pact'
    };
  }

  if (normalized.includes('necromancer')) {
    return {
      name: 'Necromancer',
      icon: Skull,
      color: 'from-stone-900 to-emerald-950',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-600/60',
      glowColor: 'shadow-emerald-950/40',
      badgeBg: 'bg-[#0a0f0d]',
      accent: '#34d399',
      tag: 'Ossuary Master'
    };
  }

  if (normalized.includes('monk')) {
    return {
      name: 'Monk',
      icon: Zap,
      color: 'from-teal-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-teal-500/20',
      badgeBg: 'bg-[#0d211f]',
      accent: '#06b6d4',
      tag: 'Martial Ascetic'
    };
  }

  if (normalized.includes('artificer')) {
    return {
      name: 'Artificer',
      icon: Hammer,
      color: 'from-orange-800 to-amber-900',
      textColor: 'text-amber-200',
      borderColor: 'border-amber-600/70',
      glowColor: 'shadow-orange-500/20',
      badgeBg: 'bg-[#26150a]',
      accent: '#f97316',
      tag: 'Apparatus Master'
    };
  }

  // Default fantasy class styling
  return {
    name: classNameStr,
    icon: Flame,
    color: 'from-amber-700 to-stone-900',
    textColor: 'text-amber-200',
    borderColor: 'border-amber-600/70',
    glowColor: 'shadow-amber-500/20',
    badgeBg: 'bg-[#1e130c]',
    accent: '#f59e0b',
    tag: 'Adventurer'
  };
};

export const ClassBadge: React.FC<ClassBadgeProps> = ({ classNameStr, size = 'md' }) => {
  const theme = getClassTheme(classNameStr);
  const IconComponent = theme.icon;

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5 font-semibold'
  }[size];

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }[size];

  return (
    <span 
      className={`inline-flex items-center rounded-lg border-2 shadow-lg backdrop-blur-sm transition-all duration-300 ${theme.badgeBg} ${theme.borderColor} ${theme.textColor} ${sizeStyles}`}
    >
      <IconComponent size={iconSizes} className="shrink-0 text-amber-400" />
      <span className="font-fantasy tracking-wider font-bold uppercase">{classNameStr}</span>
    </span>
  );
};
