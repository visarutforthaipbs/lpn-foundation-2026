import type { GlobalConfig } from 'payload'
import { revalidateLayout } from '../hooks/revalidate'
import { adminOnly, isAdmin, type Role } from '../access/roles'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true, update: adminOnly },
  versions: { max: 25 },
  admin: { group: 'Site', hidden: ({ user }) => !isAdmin(user as { role?: Role | null } | null) },
  hooks: { afterChange: [revalidateLayout] },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navItems',
      type: 'array',
      labels: { singular: 'Nav Item', plural: 'Nav Items' },
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true, admin: { description: 'e.g. /about' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'donateLabel', type: 'text', localized: true, defaultValue: 'Donate' },
        { name: 'donateHref', type: 'text', defaultValue: '/donate' },
      ],
    },
  ],
}
