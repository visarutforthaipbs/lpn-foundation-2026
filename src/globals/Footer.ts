import type { GlobalConfig } from 'payload'
import { revalidateLayout } from '../hooks/revalidate'
import { approverOnlyField } from '../access/roles'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  versions: { max: 25 },
  admin: { group: 'Site' },
  hooks: {
    afterChange: [revalidateLayout],
    afterRead: [({ doc, req }) => {
      if (req.user) return doc
      const bankReady = Boolean(doc.bankVerifiedAt && doc.bankVerifiedBy && doc.bankAccountName && doc.bankName && doc.bankAccountNumber)
      const givingReady = Boolean(doc.globalGivingProjectUrl && doc.globalGivingVerifiedAt && doc.globalGivingVerifiedBy)
      return {
        ...doc,
        bankDetails: null,
        ...(givingReady ? {} : {
          globalGivingProjectUrl: null,
          globalGivingVerifiedAt: null,
          globalGivingVerifiedBy: null,
        }),
        ...(bankReady ? {} : {
          bankVerifiedAt: null,
          bankVerifiedBy: null,
          bankAccountName: null,
          bankName: null,
          bankAccountNumber: null,
          bankSwift: null,
        }),
      }
    }],
  },
  fields: [
    { name: 'address', type: 'richText', localized: true },
    {
      name: 'hotlines',
      type: 'array',
      access: { create: approverOnlyField, update: approverOnlyField },
      labels: { singular: 'Hotline', plural: 'Hotlines' },
      admin: { description: 'Multilingual support phone numbers.' },
      fields: [
        { name: 'language', type: 'text', required: true, admin: { description: 'e.g. Thai, Khmer, Lao, Burmese' } },
        { name: 'phone', type: 'text', required: true },
        { name: 'verifiedAt', type: 'date', admin: { description: 'Date LPN confirmed the number and language coverage.' } },
        { name: 'verifiedBy', type: 'text', admin: { description: 'LPN staff member responsible for the verification.' } },
        { name: 'availability', type: 'text', localized: true, admin: { description: 'Only publish hours or response expectations after staff confirmation.' } },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      labels: { singular: 'Social Link', plural: 'Social Links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['Facebook', 'Instagram', 'X', 'YouTube', 'LinkedIn', 'TikTok'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'bankDetails',
      type: 'richText',
      access: { create: approverOnlyField, update: approverOnlyField },
      localized: true,
      admin: { description: 'Donation / bank transfer details shown in the footer or donate page.' },
    },
    { name: 'bankVerifiedAt', type: 'date', access: { create: approverOnlyField, update: approverOnlyField }, admin: { description: 'Confirm current account details before public promotion.' } },
    { name: 'bankVerifiedBy', type: 'text', access: { create: approverOnlyField, update: approverOnlyField } },
    { name: 'bankAccountName', type: 'text', access: { create: approverOnlyField, update: approverOnlyField }, admin: { description: 'Published only when all bank fields and verification fields are complete.' } },
    { name: 'bankName', type: 'text', access: { create: approverOnlyField, update: approverOnlyField }, localized: true },
    { name: 'bankAccountNumber', type: 'text', access: { create: approverOnlyField, update: approverOnlyField } },
    { name: 'bankSwift', type: 'text', access: { create: approverOnlyField, update: approverOnlyField } },
    { name: 'globalGivingProjectUrl', type: 'text', access: { create: approverOnlyField, update: approverOnlyField }, admin: { description: 'Only add LPN’s live GlobalGiving project URL after approval. Payment integration must be connected separately; the current donation flow is a design preview.' } },
    { name: 'globalGivingVerifiedAt', type: 'date', access: { create: approverOnlyField, update: approverOnlyField }, admin: { description: 'Date LPN confirmed this project page receives gifts for LPN.' } },
    { name: 'globalGivingVerifiedBy', type: 'text', access: { create: approverOnlyField, update: approverOnlyField }, admin: { description: 'LPN staff member who verified the project page.' } },
  ],
}
