// Hero photos per page (2026-10). Real LPN photographs from the media library (already published on the Wix site),
// referenced by Payload filename so they survive DB clones. Served through Payload's /api/media/file route.
const f = (filename: string) => `/api/media/file/${filename}`

export const HERO_IMAGES = {
  contact: f('d90624_851cb525f34f44bea91af56232ac6e30_mv2-3-bjANf7XPtPLAGvK5dcB4lIPG7Z4UOB.jpg'), // meeting with partners
  team: f('d90624_ef2e8fe38a694f0daa416f918fbb5fe2_mv2-3-k8ynr8EH0HFqDMsosm94u81OO4tblm.jpg'), // group photo, learning centre
  projects: f('d90624_b9e8f5878992448ea93b1468e516b3a9_mv2-4-i9T7lQaSuFvdKiGswLuigxXNEU6D0p.jpg'), // youth training session
  services: f('d90624_9301f5eb0f7f47ddad0fad692733b423_mv2-3-vsTeIfFn77lAVEisd5cimoVDAcA3zi.jpeg'), // field team with community
  news: f('d90624_960e8d3c5b074ae486d6805ecf5cc17c_mv2-3-GbfVXgY0vtyPhUfL4ccpHErc8DoiZO.jpg'), // panel / launch event
  stories: f('f72a59_3f888776246d4b8fb606190e9296fa5e_mv2-3-5HUUwx6febXd9kRr3aMvgC7WoNzcXS.jpg'), // community cultural day
} as const
