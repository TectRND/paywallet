import type { CollectionConfig } from 'payload'
import { customerOwnedOnly } from '../access/customerScope'

export const EvmSmartAccounts: CollectionConfig = {
  slug: 'evm_smart_accounts',
  admin: { hidden: true },

  access: {
    read: customerOwnedOnly,
    create: customerOwnedOnly,
    update: customerOwnedOnly,
    delete: () => false,
  },

  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      unique: true,
    },
    {
      name: 'smartAccountAddress',
      type: 'text',
      required: true,
      unique: true,
    },

    // Deterministic identity inputs
    { name: 'salt', type: 'text', required: true },
    { name: 'factoryAddress', type: 'text', required: true },
    { name: 'adminAddress', type: 'text', required: true },

    {
      name: 'supportedChainIds',
      type: 'number',
      hasMany: true,
      required: true,
      defaultValue: [1, 56, 8453, 42161, 137],
    },

    {
      name: 'custodyMode',
      type: 'select',
      required: true,
      defaultValue: 'backend',
      options: ['backend', 'user_connected'],
    },

    { name: 'aaConfigVersion', type: 'text', defaultValue: 'v1' },
  ],
}
