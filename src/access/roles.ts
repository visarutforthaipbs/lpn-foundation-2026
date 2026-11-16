import type { Access, FieldAccess } from 'payload'

// Three roles (see docs/EDITOR-GUIDE.md):
//   admin    – everything, incl. users, menu, delete
//   approver – publishes stories, owns hotlines / bank / donation links (LPN sign-off), deletes content
//   editor   – writes and edits posts, pages, reports, media; cannot publish stories or touch sign-off data
// `role` is saved in the JWT (saveToJWT) so these checks need no DB lookup.
export type Role = 'admin' | 'editor' | 'approver'
type U = { role?: Role | null } | null | undefined

export const roleOf = (user: U): Role | null => (user ? (user.role ?? 'editor') : null)
export const isAdmin = (user: U) => roleOf(user) === 'admin'
export const isApprover = (user: U) => roleOf(user) === 'admin' || roleOf(user) === 'approver'
export const isStaff = (user: U) => roleOf(user) !== null

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)
export const approverOnly: Access = ({ req: { user } }) => isApprover(user)
export const staffOnly: Access = ({ req: { user } }) => isStaff(user)

export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdmin(user)
export const approverOnlyField: FieldAccess = ({ req: { user } }) => isApprover(user)
