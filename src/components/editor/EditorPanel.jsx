import React, { useState, useEffect } from 'react';
import { manifests, themeManifest, paletteColors } from '../prototype/manifest';

// ── Sub-editors ──
function TextEditor({ field, value, onChange }) {
  const { min = 0, max = 200, label } = field;
  const len = (value || '').length;
  const isValid = len >= min && len <= max;
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border ${isValid ? 'border-gray-300' : 'border-red-400'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
        maxLength={max}
      />
      <div className={`text-xs mt-1 ${isValid ? 'text-gray-400' : 'text-red-500'}`}>
        {len}/{max}
      </div>
    </div>
  );
}

function SelectEditor({ field, value, onChange }) {
  const { label, options = [] } = field;
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorPicker({ field, value, onChange }) {
  const { label, options = [] } = field;
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => {
          const c = paletteColors[opt];
          if (!c) return null;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`w-8 h-8 ${c.bg} rounded-full border-2 ${value === opt ? 'border-gray-900 scale-110' : 'border-gray-300'} transition-all`}
              title={opt}
            />
          );
        })}
      </div>
    </div>
  );
}

function ImagePicker({ field, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{field.label}</label>
      {value?.id && (
        <img
          src={`https://images.unsplash.com/${value.id}?w=300&h=150&fit=crop`}
          alt=""
          className="w-full h-16 object-cover rounded-lg mb-2"
        />
      )}
      <input
        type="text"
        value={value?.id || ''}
        placeholder="Unsplash photo ID (e.g. photo-155...)"
        onChange={(e) => onChange({ ...(value || {}), id: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
}

// ── Helper: deeply update a nested property in JSON ──
function setNestedPath(obj, path, value) {
  const keys = path.split('.');
  const newObj = JSON.parse(JSON.stringify(obj));
  let cursor = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cursor[keys[i]]) cursor[keys[i]] = {};
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return newObj;
}

const FALLBACK_JSON = {
  meta: { templateId: 'service-landing-v1', schemaVersion: 1, businessName: 'Your Business' },
  theme: { palette: 'indigo', accent: 'amber', headingFont: 'sora', bodyFont: 'inter', radius: 'md' },
  sections: [
    {
      id: 'sec_hero',
      type: 'hero',
      visible: true,
      variant: 'centered',
      props: {
        headline: { text: 'Your Website. Built Before You Pay.' },
        subhead: { text: 'Preview your custom demo — no commitment required.' },
        ctaPrimary: { text: 'Get Started', action: 'scrollTo:contact' },
        ctaSecondary: { text: 'Learn More', action: 'scrollTo:features' },
      },
    },
    {
      id: 'sec_features',
      type: 'feature-grid',
      visible: true,
      variant: 'three-col',
      props: {
        heading: { text: 'Why Quaitrix' },
        items: [
          { title: { text: 'Fast' }, body: { text: 'Demos delivered in minutes.' }, icon: 'bolt' },
          { title: { text: 'Affordable' }, body: { text: 'Transparent pricing, no surprises.' }, icon: 'dollar' },
          { title: { text: 'Professional' }, body: { text: 'Pixel-perfect, production-ready code.' }, icon: 'star' },
        ],
      },
    },
    {
      id: 'sec_contact',
      type: 'contact',
      visible: true,
      variant: 'standard',
      props: { heading: { text: 'Get In Touch' }, subhead: { text: 'Ready to start? Send us a message.' } },
    },
  ],
};

// ── Main Editor Panel ──
export default function EditorPanel({ json: providedJson, token }) {
  const [currentJson, setCurrentJson] = useState(providedJson || FALLBACK_JSON);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (providedJson || !token) return;
    fetch(`/demo/${token}/prototype.json`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data) => {
        if (data && data.sections) setCurrentJson(data);
      })
      .catch(() => {});
  }, [token, providedJson]);

  const updateSectionProp = (sectionIdx, propPath, value) => {
    setCurrentJson((prev) => {
      const newSections = prev.sections.map((s, i) => {
        if (i !== sectionIdx) return s;
        const newProps = setNestedPath(s.props || {}, propPath, value);
        return { ...s, props: newProps };
      });
      return { ...prev, sections: newSections };
    });
  };

  const updateTheme = (key, value) => {
    setCurrentJson((prev) => ({ ...prev, theme: { ...(prev.theme || {}), [key]: value } }));
  };

  const toggleSection = (idx) => {
    setCurrentJson((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === idx ? { ...s, visible: !(s.visible !== false) } : s)),
    }));
  };

  const saveEdit = async () => {
    setSaving(true);
    setError(null);
    setValidationErrors([]);
    try {
      const res = await fetch(`/api/prototype/${token}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentJson),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        if (data.details) setValidationErrors(data.details);
        setError(data.error || 'Save failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setSaving(false);
  };

  const handleApprove = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/prototype/${token}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Approve failed');
        return;
      }
      // Show success with link to updated demo
      setSaved(true);
      if (data.demo_url) {
        setTimeout(() => window.open(data.demo_url, '_blank'), 500);
      }
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Connection error. Please try again.');
    }
    setSaving(false);
  };

  const renderField = (fieldKey, def, sectionIdx) => {
    const section = currentJson.sections[sectionIdx];
    const keys = fieldKey.split('.');
    let value = section?.props;
    for (const k of keys) value = value?.[k];

    if (def.kind === 'text')
      return (
        <TextEditor
          key={fieldKey}
          field={def}
          value={value}
          onChange={(v) => updateSectionProp(sectionIdx, fieldKey, v)}
        />
      );
    if (def.kind === 'select')
      return (
        <SelectEditor
          key={fieldKey}
          field={def}
          value={value}
          onChange={(v) => updateSectionProp(sectionIdx, fieldKey, v)}
        />
      );
    if (def.kind === 'unsplash')
      return (
        <ImagePicker
          key={fieldKey}
          field={def}
          value={value}
          onChange={(v) => updateSectionProp(sectionIdx, fieldKey, v)}
        />
      );
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Demo Editor</h2>

        {/* Validation / Error Display */}
        {(validationErrors.length > 0 || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-semibold text-red-700 mb-1">{error}</p>
            {validationErrors.map((err, i) => (
              <p key={i} className="text-xs text-red-600">
                {err}
              </p>
            ))}
          </div>
        )}

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-semibold text-green-700">Success! Demo updated.</p>
          </div>
        )}

        {/* Theme Controls */}
        <div className="mb-5 p-3 bg-white rounded-xl border border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Theme</h3>
          {Object.entries(themeManifest).map(([key, def]) => {
            if (def.options?.[0] in paletteColors)
              return (
                <ColorPicker
                  key={key}
                  field={def}
                  value={currentJson.theme?.[key]}
                  onChange={(v) => updateTheme(key, v)}
                />
              );
            return (
              <SelectEditor
                key={key}
                field={def}
                value={currentJson.theme?.[key]}
                onChange={(v) => updateTheme(key, v)}
              />
            );
          })}
        </div>

        {/* Section Toggles */}
        <div className="mb-5 p-3 bg-white rounded-xl border border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Sections</h3>
          {(currentJson.sections || []).map((section, idx) => {
            const m = manifests[section.type];
            return (
              <label key={section.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={section.visible !== false}
                  onChange={() => toggleSection(idx)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">{m?.label || section.type}</span>
              </label>
            );
          })}
        </div>

        {/* Per-Section Fields */}
        {(currentJson.sections || []).map((section, sectionIdx) => {
          const m = manifests[section.type];
          if (!m) return null;
          return (
            <div key={section.id} className="mb-4 p-3 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">{m.label}</h3>
              {Object.entries(m.fields)
                .filter(([, d]) => d.kind !== 'list')
                .map(([key, def]) => renderField(key, def, sectionIdx))}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t border-gray-200 space-y-2">
        <button
          onClick={saveEdit}
          disabled={saving}
          className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
        <button
          onClick={handleApprove}
          disabled={saving}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Approve & Rebuild Site
        </button>
      </div>
    </div>
  );
}
