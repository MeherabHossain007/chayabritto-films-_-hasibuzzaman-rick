'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient: 'primary' | 'blue' | 'emerald' | 'violet';
}

const gradientMap = {
  primary: {
    bg: 'bg-gradient-to-br from-primary-500/10 to-primary-600/5',
    border: 'border-primary-800/30',
    iconBg: 'bg-gradient-to-br from-primary-500 to-primary-700',
    iconShadow: 'shadow-primary-900/40',
    text: 'text-primary-400',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
    border: 'border-blue-800/30',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700',
    iconShadow: 'shadow-blue-900/40',
    text: 'text-blue-400',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-800/30',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    iconShadow: 'shadow-emerald-900/40',
    text: 'text-emerald-400',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-500/10 to-violet-600/5',
    border: 'border-violet-800/30',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-700',
    iconShadow: 'shadow-violet-900/40',
    text: 'text-violet-400',
  },
};

export default function StatsCard({ title, value, icon: Icon, trend, gradient }: StatsCardProps) {
  const colors = gradientMap[gradient];

  return (
    <div
      className={`relative rounded-2xl p-6 border ${colors.border} ${colors.bg}
        backdrop-blur-sm overflow-hidden transition-all duration-300
        hover:scale-[1.02] hover:shadow-lg group`}
    >
      {/* Background glow effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl 
        group-hover:from-white/10 transition-all duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-stone-500 text-xs font-medium uppercase tracking-[0.15em] mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-stone-100 tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-2 ${colors.text} font-medium`}>
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center
            shadow-lg ${colors.iconShadow}`}
        >
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}
