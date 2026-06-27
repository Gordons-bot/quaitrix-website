// PrototypeRenderer.jsx — Maps JSON sections → React components
// Fetches JSON client-side from /demos/{token}/prototype.json
import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import FeatureGrid from './FeatureGrid';
import Contact from './Contact';

const componentMap = {
  hero: Hero,
  'feature-grid': FeatureGrid,
  contact: Contact
};

const FALLBACK_JSON = {
  meta: { templateId: 'service-landing-v1', schemaVersion: 1, businessName: 'Your Business' },
  theme: { palette: 'indigo', accent: 'amber', headingFont: 'sora', bodyFont: 'inter', radius: 'md' },
  sections: [
    {
      id: 'sec_hero', type: 'hero', visible: true, variant: 'centered',
      props: {
        headline: { text: 'Your Website. Built Before You Pay.' },
        subhead: { text: 'Preview your custom demo — no commitment required.' },
        ctaPrimary: { text: 'Get Started', action: 'scrollTo:contact' },
        ctaSecondary: { text: 'Learn More', action: 'scrollTo:features' }
      }
    },
    {
      id: 'sec_features', type: 'feature-grid', visible: true, variant: 'three-col',
      props: {
        heading: { text: 'Why Quaitrix' },
        items: [
          { title: { text: 'Fast' }, body: { text: 'Demos delivered in minutes.' }, icon: 'bolt' },
          { title: { text: 'Affordable' }, body: { text: 'Transparent pricing, no surprises.' }, icon: 'dollar' },
          { title: { text: 'Professional' }, body: { text: 'Pixel-perfect, production-ready code.' }, icon: 'star' }
        ]
      }
    },
    {
      id: 'sec_contact', type: 'contact', visible: true, variant: 'standard',
      props: { heading: { text: 'Get In Touch' }, subhead: { text: 'Ready to start? Send us a message.' } }
    }
  ]
};

export default function PrototypeRenderer({ token, json: providedJson }) {
  const [json, setJson] = useState(providedJson || null);
  const [loading, setLoading] = useState(!providedJson && !!token);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (providedJson || !token) return;
    setLoading(true);
    fetch(`/demo/${token}/prototype.json`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(data => { if (data && data.sections) setJson(data); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token, providedJson]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading demo...</div>;
  }

  const data = json || FALLBACK_JSON;

  if (!data.sections || data.sections.length === 0) {
    return <div className="p-8 text-center text-gray-500">No sections defined</div>;
  }

  const theme = data.theme || { palette: 'indigo', radius: 'md' };
  const sectionsWithTheme = data.sections.map(s => ({ ...s, _theme: theme }));

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900">
            {data.meta?.businessName || 'Your Business'}
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-600">
            {sectionsWithTheme.filter(s => s.visible !== false).map(s => (
              <a key={s.id} href={`#${s.type === 'hero' ? 'home' : s.type === 'feature-grid' ? 'features' : 'contact'}`}
                 className="hover:text-gray-900 transition-colors">
                {s.type === 'hero' ? 'Home' : s.type === 'feature-grid' ? 'Features' : 'Contact'}
              </a>
            ))}
          </div>
          <a href="#contact"
             className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">
            Get Started
          </a>
        </div>
      </nav>

      {/* Sections */}
      {sectionsWithTheme.map((section) => {
        if (section.visible === false) return null;
        const Component = componentMap[section.type];
        if (!Component) return null;
        return <Component key={section.id} section={section} />;
      })}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center text-sm">
          <p>
            &copy; {(new Date()).getFullYear()} {data.meta?.businessName || 'Your Business'}. Built by{' '}
            <span className="text-indigo-400 font-semibold">Quaitrix</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
