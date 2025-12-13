import type { Access } from 'payload'

export const customerDocOnly: Access = ({ req }) => {
  if (!req.user || req.user.collection !== 'customers') return false
  return { id: { equals: req.user.id } }
}

export const customerOwnedOnly: Access = ({ req }) => {
  if (!req.user || req.user.collection !== 'customers') return false
  return { customer: { equals: req.user.id } }
}
