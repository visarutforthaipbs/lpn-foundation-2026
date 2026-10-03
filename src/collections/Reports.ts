import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { revalidateEvidence } from '../hooks/revalidate'

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'year', 'reviewedAt', '_status'],
    group: 'Evidence',
  },
  access: {
    read: ({ req: { user } }) => user ? true : { _status: { equals: 'published' } },
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'kind', type: 'select', required: true,
      options: [
        { label: 'Annual report', value: 'annual' },
        { label: 'Field research', value: 'research' },
        { label: 'Programme report', value: 'programme' },
      ],
    },
    {
      name: 'topic', type: 'select',
      options: [
        { label: 'Cross-cutting', value: 'cross-cutting' },
        { label: 'Worker rights', value: 'rights' },
        { label: 'Health', value: 'health' },
        { label: 'Education and youth', value: 'education' },
        { label: 'Trafficking and safety', value: 'safety' },
        { label: 'Policy and systems', value: 'policy' },
      ],
    },
    { name: 'year', type: 'number', required: true, min: 2000, max: 2100 },
    { name: 'publishedAt', type: 'date' },
    { name: 'summary', type: 'textarea', localized: true, required: true },
    { name: 'method', type: 'textarea', localized: true, admin: { description: 'Scope, sample, definitions and important limits.' } },
    { name: 'sourceURL', type: 'text', required: true, admin: { description: 'Canonical source or announcement URL.' } },
    { name: 'downloadURL', type: 'text', admin: { description: 'Direct PDF/download URL when available.' } },
    { name: 'documentLanguage', type: 'select', required: true, options: ['th', 'en', 'multilingual'] },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'reviewedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'reviewedBy', type: 'text', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      const next = { ...originalDoc, ...data }
      if (next._status === 'published' && (!next.reviewedAt || !next.reviewedBy)) {
        throw new Error('A report needs a reviewer and review date before publication.')
      }
      return data
    }],
    afterChange: [revalidateEvidence],
  },
}
