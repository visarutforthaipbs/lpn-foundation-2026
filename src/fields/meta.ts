import type { Field } from 'payload'

/** Lightweight, localized SEO group used by posts and pages. */
export const metaField: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Overrides the page/post title in <title> and social cards.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Meta description (~155 chars).' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Open Graph / social share image.' },
    },
  ],
}
