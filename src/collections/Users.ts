import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, isAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Site',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    // Admins manage accounts; everyone else can only see and edit their own (name / password).
    create: adminOnly,
    delete: adminOnly,
    read: ({ req: { user } }) => (isAdmin(user) ? true : user ? { id: { equals: user.id } } : false),
    update: ({ req: { user } }) => (isAdmin(user) ? true : user ? { id: { equals: user.id } } : false),
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', admin: { description: 'Display name, e.g. Thai first name.' } },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { create: adminOnlyField, update: adminOnlyField },
      options: [
        { label: 'Admin — everything incl. users and menu', value: 'admin' },
        { label: 'Approver — publishes stories; hotlines, bank, donation links', value: 'approver' },
        { label: 'Editor — posts, pages, reports, media', value: 'editor' },
      ],
      admin: { position: 'sidebar', description: 'Only an admin can change this.' },
    },
  ],
}
