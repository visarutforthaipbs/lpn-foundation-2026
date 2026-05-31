import type { Block } from 'payload'

const linkFields: Block['fields'] = [
  { name: 'ctaLabel', type: 'text', localized: true },
  { name: 'ctaHref', type: 'text', admin: { description: 'e.g. /donate or https://…' } },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'subheading', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    ...linkFields,
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats', plural: 'Stats' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "71%"' } },
        { name: 'label', type: 'text', localized: true, required: true },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [{ name: 'content', type: 'richText', localized: true, required: true }],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + Text', plural: 'Image + Text' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'content', type: 'richText', localized: true, required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'body', type: 'textarea', localized: true },
    ...linkFields,
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team Grid', plural: 'Team Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: { description: 'Renders all Team Members (managed in the Team Members collection).' },
    },
  ],
}

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  labels: { singular: 'Contact Info', plural: 'Contact Info' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
  ],
}

export const DonationDetailsBlock: Block = {
  slug: 'donationDetails',
  labels: { singular: 'Donation Details', plural: 'Donation Details' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: { description: 'Bank transfer details, sponsorship info, etc.' },
    },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  StatsBlock,
  RichTextBlock,
  ImageTextBlock,
  CTABlock,
  TeamGridBlock,
  ContactInfoBlock,
  DonationDetailsBlock,
]
