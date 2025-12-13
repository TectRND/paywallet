import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const TokenAllowlist: CollectionConfig = {
  slug: 'token_allowlist',
  admin: { useAsTitle: 'symbol' },

  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  fields: [
    { name: 'symbol', type: 'text', required: true },
    { name: 'name', type: 'text' },
    { name: 'chainId', type: 'number', required: true },
    { name: 'contractAddress', type: 'text', required: true },
    { name: 'decimals', type: 'number', required: true },
    { name: 'confirmationsRequired', type: 'number', required: true, defaultValue: 12 },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
