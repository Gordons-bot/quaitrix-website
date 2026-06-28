// Hero.jsx — Renders hero section from JSON props
// CRITICAL: All Tailwind classes must be LITERAL strings (not dynamic) so Tailwind's scanner preserves them

import React from 'react';

// Full palette mappings — every class listed here appears literally so Tailwind keeps them
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

export default function Hero({ section }) {
  const { variant = 'centered', props = {} } = section;
  const { headline, subhead, ctaPrimary, ctaSecondary, image } = props;

  // Resolve palette — use indigo as fallback
  const theme = section._theme || { palette: 'indigo', radius: 'md' };
  const p = PALETTES[theme.palette] || PALETTES.indigo;
  const r = RADII[theme.radius] || RADII.md;

  if (variant === 'centered') {
    return (
      <section id="home" className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              {headline?.text || 'Your Headline Here'}
            </h1>
            {subhead?.text && <p className="mt-6 text-lg text-gray-600 leading-relaxed">{subhead.text}</p>}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {ctaPrimary?.text && (
                <a
                  href={`#${(ctaPrimary.action && ctaPrimary.action.split(':')[1]) || 'contact'}`}
                  className={`inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white ${p.bg} ${p.hover} ${r} shadow-lg transition-all hover:scale-[1.02]`}
                >
                  {ctaPrimary.text}
                </a>
              )}
              {ctaSecondary?.text && (
                <a
                  href={`#${(ctaSecondary.action && ctaSecondary.action.split(':')[1]) || 'features'}`}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  {ctaSecondary.text}
                </a>
              )}
            </div>
            {image?.id && (
              <div className="mt-16">
                <img
                  src={`https://images.unsplash.com/${image.id}?w=1200&h=600&fit=crop`}
                  alt={image.alt || 'Hero'}
                  className={`w-full ${r} shadow-xl`}
                  loading="eager"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Split variant
  return (
    <section id="home" className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              {headline?.text || 'Your Headline Here'}
            </h1>
            {subhead?.text && <p className="mt-6 text-lg text-gray-600 leading-relaxed">{subhead.text}</p>}
            <div className="mt-8 flex gap-4">
              {ctaPrimary?.text && (
                <a
                  href="#contact"
                  className={`inline-flex px-6 py-3 text-white ${p.bg} ${p.hover} ${r} font-semibold shadow-lg`}
                >
                  {ctaPrimary.text}
                </a>
              )}
            </div>
          </div>
          {image?.id && (
            <img
              src={`https://images.unsplash.com/${image.id}?w=800&h=600&fit=crop`}
              alt={image.alt || 'Hero'}
              className={`w-full ${r} shadow-2xl`}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
}
