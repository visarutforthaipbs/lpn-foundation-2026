import type { CollectionConfig } from 'payload'
import { approverOnly } from '../access/roles'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'title', group: 'Blog' },
  access: { read: () => true, delete: approverOnly },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
  ],
}
