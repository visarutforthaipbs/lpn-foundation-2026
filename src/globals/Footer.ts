import type { GlobalConfig } from 'payload'
import { revalidateLayout } from '../hooks/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  admin: { group: 'Site' },
  hooks: { afterChange: [revalidateLayout] },
  fields: [
    { name: 'address', type: 'richText', localized: true },
    {
      name: 'hotlines',
      type: 'array',
      labels: { singular: 'Hotline', plural: 'Hotlines' },
      admin: { description: 'Multilingual support phone numbers.' },
      fields: [
        { name: 'language', type: 'text', required: true, admin: { description: 'e.g. Thai, Khmer, Lao, Burmese' } },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      labels: { singular: 'Social Link', plural: 'Social Links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['Facebook', 'Instagram', 'X', 'YouTube', 'LinkedIn', 'TikTok'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'bankDetails',
      type: 'richText',
      localized: true,
      admin: { description: 'Donation / bank transfer details shown in the footer or donate page.' },
    },
  ],
}
