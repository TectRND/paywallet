import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  return Boolean(req.user && req.user.collection === 'admins')
}
