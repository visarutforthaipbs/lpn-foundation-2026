import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { metaField } from '../fields/meta'
import { revalidatePost, revalidatePostDelete } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Blog',
  },
  access: {
    // Public can read published docs; drafts stay private to the admin.
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
      // Source language of the post. The blog index for each locale shows only
      // posts of that language (Wix stored EN and TH as separate posts).
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'ไทย', value: 'th' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publishedAt',
          type: 'date',
          admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    metaField,
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Default publishedAt to now when first published.
        if (data?._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
  },
}
