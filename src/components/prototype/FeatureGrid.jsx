// FeatureGrid.jsx — Renders feature grid section from JSON props

import React from 'react';

const PALETTES = {
  indigo: {
    primary: 'text-indigo-600',
    bg: 'bg-indigo-600',
    hover: 'hover:bg-indigo-700',
    light: 'bg-indigo-50',
    ring: 'ring-indigo-500',
  },
  blue: {
    primary: 'text-blue-600',
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    light: 'bg-blue-50',
    ring: 'ring-blue-500',
  },
  emerald: {
    primary: 'text-emerald-600',
    bg: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
    light: 'bg-emerald-50',
    ring: 'ring-emerald-500',
  },
  rose: {
    primary: 'text-rose-600',
    bg: 'bg-rose-600',
    hover: 'hover:bg-rose-700',
    light: 'bg-rose-50',
    ring: 'ring-rose-500',
  },
  amber: {
    primary: 'text-amber-600',
    bg: 'bg-amber-600',
    hover: 'hover:bg-amber-700',
    light: 'bg-amber-50',
    ring: 'ring-amber-500',
  },
  violet: {
    primary: 'text-violet-600',
    bg: 'bg-violet-600',
    hover: 'hover:bg-violet-700',
    light: 'bg-violet-50',
    ring: 'ring-violet-500',
  },
  slate: {
    primary: 'text-slate-700',
    bg: 'bg-slate-700',
    hover: 'hover:bg-slate-800',
    light: 'bg-slate-100',
    ring: 'ring-slate-500',
  },
};

const RADII = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
};

const iconMap = {
  bolt: '⚡',
  shield: '🛡',
  dollar: '$',
  star: '⭐',
  heart: '❤',
  check: '✓',
  rocket: '🚀',
  globe: '🌍',
};

export default function FeatureGrid({ section }) {
  const { variant = 'three-col', props = {} } = section;
  const { heading, items = [] } = props;
  const theme = section._theme || { palette: 'indigo', radius: 'md' };
  const p = PALETTES[theme.palette] || PALETTES.indigo;
  const r = RADII[theme.radius] || RADII.md;

  const gridClass =
    {
      'three-col': 'md:grid-cols-3',
      'two-col': 'md:grid-cols-2',
      'four-col': 'md:grid-cols-2 lg:grid-cols-4',
    }[variant] || 'md:grid-cols-3';

  if (!items.length) return null;

  return (
    <section id="features" className={`py-20 ${p.light}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {heading?.text && (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{heading.text}</h2>
          </div>
        )}
        <div className={`grid ${gridClass} gap-8`}>
          {items.map((item, idx) => (
            <div key={idx} className={`p-8 bg-white ${r} shadow-sm border border-gray-100 flex flex-col h-full`}>
              <div className={`w-12 h-12 ${p.light} ${p.primary} ${r} flex items-center justify-center text-xl mb-5`}>
                {iconMap[item.icon] || '●'}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.title?.text || 'Feature'}</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed flex-1">{item.body?.text || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
