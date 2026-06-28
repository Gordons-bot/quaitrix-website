// Contact.jsx — Renders contact section from JSON props

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

export default function Contact({ section }) {
  const { props = {} } = section;
  const { heading, subhead } = props;
  const theme = section._theme || { palette: 'indigo', radius: 'md' };
  const p = PALETTES[theme.palette] || PALETTES.indigo;
  const r = RADII[theme.radius] || RADII.md;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          {heading?.text && (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{heading.text}</h2>
          )}
          {subhead?.text && <p className="mt-4 text-lg text-gray-600 leading-relaxed">{subhead.text}</p>}
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className={`w-full px-4 py-3 border border-gray-300 ${r} focus:ring-2 ${p.ring} focus:border-transparent outline-none`}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-3 border border-gray-300 ${r} focus:ring-2 ${p.ring} focus:border-transparent outline-none`}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              rows={5}
              className={`w-full px-4 py-3 border border-gray-300 ${r} focus:ring-2 ${p.ring} focus:border-transparent outline-none resize-none`}
              placeholder="Tell us about your project..."
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className={`inline-flex px-8 py-4 text-white ${p.bg} ${p.hover} ${r} font-semibold shadow-lg transition-all hover:scale-[1.02]`}
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
