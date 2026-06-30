import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Services',
      href: getPermalink('/services'),
    },
    {
      text: 'Start Project',
      href: getPermalink('/start-project'),
    },
  ],
  actions: [{ text: 'Start Project', href: getPermalink('/start-project') }],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [
        { text: 'Websites', href: getPermalink('/services') },
        { text: 'Android Apps', href: getPermalink('/services') },
        { text: 'Start Project', href: getPermalink('/start-project') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [{ ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' }],
  companyDescription:
    'Quaitrix is a small team of developers and designers who previously worked for large firms. We bring enterprise-level expertise to small businesses in Mauritius.',
  contactEmail: 'manager@quaitrix.com',
  footNote: `
    © <span class="font-semibold">Quaitrix</span>. All rights reserved.
  `,
};
