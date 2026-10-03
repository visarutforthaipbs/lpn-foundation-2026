import type { CollectionConfig, Where } from 'payload'
import { slugField } from '../fields/slug'
import { revalidateEvidence } from '../hooks/revalidate'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'storyDate', 'consentStatus', 'safetyReviewedAt', '_status'],
    group: 'Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      const publicStory: Where = {
        and: [
          { _status: { equals: 'published' } },
          { consentStatus: { equals: 'approved' } },
        ],
      }
      return publicStory
    },
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField('title'),
    { name: 'summary', type: 'textarea', localized: true, required: true },
    { name: 'content', type: 'richText', localized: true, required: true },
    { name: 'storyDate', type: 'date' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'anonymity', type: 'select', required: true, defaultValue: 'anonymous',
      options: [
        { label: 'Anonymous', value: 'anonymous' },
        { label: 'Pseudonym', value: 'pseudonym' },
        { label: 'Identified with consent', value: 'identified' },
      ],
    },
    {
      name: 'consentStatus', type: 'select', required: true, defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'consentScope', type: 'textarea', access: { read: ({ req }) => Boolean(req.user) }, admin: { description: 'Where text use was approved. Keep private case details outside this CMS.' } },
    { name: 'imageUseApproved', type: 'checkbox', defaultValue: false, admin: { description: 'Required if a cover image identifies or depicts people.' } },
    { name: 'safetyReviewedAt', type: 'date', access: { read: ({ req }) => Boolean(req.user) }, admin: { position: 'sidebar' } },
    { name: 'approvedBy', type: 'text', access: { read: ({ req }) => Boolean(req.user) }, admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      const next = { ...originalDoc, ...data }
      if (next._status === 'published' && (
        next.consentStatus !== 'approved' || !next.consentScope || !next.safetyReviewedAt || !next.approvedBy || !next.storyDate ||
        (next.coverImage && !next.imageUseApproved)
      )) {
        throw new Error('A story needs documented consent, safety review, and an approver before publication.')
      }
      return data
    }],
    afterChange: [revalidateEvidence],
  },
}
