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
    afterRead: [({ doc, req }) => {
      // The Wix source archive and seeded donation blocks keep historical bank
      // and phone details for editors. The frontend never renders them, so keep
      // them out of public REST/GraphQL responses too. Local API reads (server
      // components, seed/migration scripts) are untouched: scripts read and
      // write back the whole layout, and stripping here would delete the blocks.
      if (req.user || req.payloadAPI === 'local' || !Array.isArray(doc?.layout)) return doc
      return {
        ...doc,
        layout: doc.layout.filter((block: { blockType?: string; blockName?: string | null }) =>
          block.blockType !== 'donationDetails' && !block.blockName?.startsWith('Wix source archive'),
        ),
      }
    }],
  },
}
