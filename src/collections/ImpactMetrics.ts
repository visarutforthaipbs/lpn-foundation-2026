import type { CollectionConfig } from 'payload'
import { revalidateEvidence } from '../hooks/revalidate'

export const ImpactMetrics: CollectionConfig = {
  slug: 'impact-metrics',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'periodLabel', 'reviewedAt', '_status'],
    group: 'Evidence',
  },
  access: {
    read: ({ req: { user } }) => user ? true : { _status: { equals: 'published' } },
  },
  versions: { drafts: true },
  fields: [
    { name: 'label', type: 'text', localized: true, required: true },
    { name: 'value', type: 'text', required: true, admin: { description: 'Display value, e.g. 135. Do not add unlike measures.' } },
    { name: 'unit', type: 'text', localized: true, required: true },
    { name: 'periodLabel', type: 'text', localized: true, required: true },
    { name: 'periodStart', type: 'date' },
    { name: 'periodEnd', type: 'date' },
    { name: 'definition', type: 'textarea', localized: true, required: true },
    { name: 'method', type: 'textarea', localized: true },
    { name: 'sourceReport', type: 'relationship', relationTo: 'reports' },
    { name: 'sourceURL', type: 'text', admin: { description: 'Use when no Report record exists.' } },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 100 },
    { name: 'reviewedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'reviewedBy', type: 'text', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      const next = { ...originalDoc, ...data }
      if (next._status === 'published' && (!next.reviewedAt || !next.reviewedBy || (!next.sourceURL && !next.sourceReport))) {
        throw new Error('A published metric needs a source, reviewer, and review date.')
      }
      return data
    }],
    afterChange: [revalidateEvidence],
  },
}
