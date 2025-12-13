import type { CollectionBeforeChangeHook } from 'payload'

export const setCustomerRole: CollectionBeforeChangeHook = async ({ operation, data }) => {
  if (operation === 'create') {
    return { ...data, role: 'customer', status: 'active' }
  }

  if (data && typeof data === 'object' && 'role' in data) {
    delete (data as any).role
  }

  return data
}
