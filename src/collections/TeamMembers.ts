import type { CollectionConfig } from 'payload'
import { approverOnly } from '../access/roles'

export const TeamMembers: CollectionConfig = {
  slug: 'teamMembers',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'order'], group: 'Content' },
  access: { read: () => true, delete: approverOnly },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText', localized: true },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
