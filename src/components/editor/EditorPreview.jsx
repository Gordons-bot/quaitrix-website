// EditorPreview.jsx — Client-side preview for the editor
// Fetches JSON at runtime, can be updated live as user edits
import React, { useState, useEffect } from 'react';
import Hero from '../prototype/Hero';
import FeatureGrid from '../prototype/FeatureGrid';
import Contact from '../prototype/Contact';

const componentMap = {
  hero: Hero,
  'feature-grid': FeatureGrid,
  contact: Contact
};

export default function EditorPreview({ json: providedJson, token }) {
  const [json, setJson] = useState(providedJson || null);

  useEffect(() => {
    if (providedJson || !token) return;
    fetch(`/demo/${token}/prototype.json`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(data => { if (data && data.sections) setJson(data); })
      .catch(() => {});
  }, [token, providedJson]);

  if (!json || !json.sections || json.sections.length === 0) {
    return <div className="p-8 text-center text-gray-500">No sections defined</div>;
  }

  const theme = json.theme || { palette: 'indigo', radius: 'md' };
  const sectionsWithTheme = json.sections.map(s => ({ ...s, _theme: theme }));

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900">
            {json.meta?.businessName || 'Your Business'}
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

      {sectionsWithTheme.map((section) => {
        if (section.visible === false) return null;
        const Component = componentMap[section.type];
        if (!Component) return null;
        return <Component key={section.id} section={section} />;
      })}

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center text-sm">
          <p>
            &copy; {(new Date()).getFullYear()} {json.meta?.businessName || 'Your Business'}. Built by{' '}
            <span className="text-indigo-400 font-semibold">Quaitrix</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
