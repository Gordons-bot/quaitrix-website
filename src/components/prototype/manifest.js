// ══════════════════════════════════════════════════════════════════════
// CAPABILITY MANIFEST — Defines what fields exist, their types, and bounds
// The editor uses this to render bounded controls
// ══════════════════════════════════════════════════════════════════════

export const heroManifest = {
  type: 'hero',
  label: 'Hero Section',
  toggleable: true,
  variants: ['centered', 'split', 'image-right'],
  fields: {
    'headline.text': { kind: 'text', min: 4, max: 60, label: 'Headline' },
    'subhead.text': { kind: 'text', min: 0, max: 140, label: 'Subheadline' },
    'ctaPrimary.text': { kind: 'text', min: 2, max: 24, label: 'Primary Button' },
    'ctaPrimary.action': { kind: 'select', options: ['scrollTo:contact', 'scrollTo:features', 'open:chat'], label: 'Primary Action' },
    'ctaSecondary.text': { kind: 'text', min: 2, max: 24, label: 'Secondary Button' },
    'ctaSecondary.action': { kind: 'select', options: ['scrollTo:contact', 'scrollTo:features', 'open:chat'], label: 'Secondary Action' },
    'image': { kind: 'unsplash', label: 'Hero Image' }
  }
};

export const featureGridManifest = {
  type: 'feature-grid',
  label: 'Features Section',
  toggleable: true,
  variants: ['three-col', 'two-col', 'four-col'],
  fields: {
    'heading.text': { kind: 'text', min: 3, max: 40, label: 'Section Heading' },
    'items': { kind: 'list', min: 2, max: 6, label: 'Feature Item', itemFields: {
      'title.text': { kind: 'text', min: 2, max: 30, label: 'Title' },
      'body.text': { kind: 'text', min: 5, max: 120, label: 'Description' },
      'icon': { kind: 'select', options: ['bolt', 'shield', 'dollar', 'star', 'heart', 'check', 'rocket', 'globe'], label: 'Icon' }
    }}
  }
};

export const contactManifest = {
  type: 'contact',
  label: 'Contact Section',
  toggleable: true,
  variants: ['standard', 'compact', 'with-map'],
  fields: {
    'heading.text': { kind: 'text', min: 3, max: 40, label: 'Heading' },
    'subhead.text': { kind: 'text', min: 0, max: 100, label: 'Subheadline' }
  }
};

export const themeManifest = {
  palette: { kind: 'select', options: ['indigo', 'blue', 'emerald', 'rose', 'amber', 'violet', 'slate'], label: 'Color Palette' },
  accent: { kind: 'select', options: ['amber', 'rose', 'emerald', 'violet', 'sky', 'orange'], label: 'Accent Color' },
  headingFont: { kind: 'select', options: ['sora', 'inter', 'poppins', 'playfair', 'montserrat'], label: 'Heading Font' },
  bodyFont: { kind: 'select', options: ['inter', 'roboto', 'open-sans', 'lato'], label: 'Body Font' },
  radius: { kind: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'], label: 'Border Radius' }
};

export const manifests = {
  hero: heroManifest,
  'feature-grid': featureGridManifest,
  contact: contactManifest
};

// Tailwind color class mapping (palette → classes)
export const paletteColors = {
  indigo: { primary: 'text-indigo-600', bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', light: 'bg-indigo-50', ring: 'ring-indigo-500' },
  blue:   { primary: 'text-blue-600', bg: 'bg-blue-600', hover: 'hover:bg-blue-700', light: 'bg-blue-50', ring: 'ring-blue-500' },
  emerald:{ primary: 'text-emerald-600', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', light: 'bg-emerald-50', ring: 'ring-emerald-500' },
  rose:   { primary: 'text-rose-600', bg: 'bg-rose-600', hover: 'hover:bg-rose-700', light: 'bg-rose-50', ring: 'ring-rose-500' },
  amber:  { primary: 'text-amber-600', bg: 'bg-amber-600', hover: 'hover:bg-amber-700', light: 'bg-amber-50', ring: 'ring-amber-500' },
  violet: { primary: 'text-violet-600', bg: 'bg-violet-600', hover: 'hover:bg-violet-700', light: 'bg-violet-50', ring: 'ring-violet-500' },
  slate:  { primary: 'text-slate-700', bg: 'bg-slate-700', hover: 'hover:bg-slate-800', light: 'bg-slate-100', ring: 'ring-slate-500' }
};

export const radiusMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl'
};
