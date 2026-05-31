import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { metaField } from '../fields/meta'
import { pageBlocks } from '../blocks'
import { revalidatePage } from '../hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      name: 'layout',
      type: 'blocks',
      blocks: pageBlocks,
      admin: { description: 'Compose the page from content blocks.' },
    },
    metaField,
  ],
  hooks: {
    afterChange: [revalidatePage],
  },
}
