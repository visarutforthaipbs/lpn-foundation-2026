import type { CollectionConfig } from 'payload'
import { approverOnly } from '../access/roles'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', group: 'Blog' },
  access: { read: () => true, delete: approverOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText', localized: true },
  ],
}
