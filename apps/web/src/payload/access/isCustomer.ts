import type { Access } from 'payload'

export const isCustomer: Access = ({ req }) => {
  return Boolean(req.user && req.user.collection === 'customers')
}
