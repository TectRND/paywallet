import type { CollectionConfig } from 'payload'
import { customerDocOnly } from '../access/customerScope'
import { setCustomerRole } from '../hooks/setCustomerRole'

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,

  // Customers must never access the Payload Admin UI; hide from Admin nav as defense-in-depth
  admin: { hidden: true },

  access: {
    read: customerDocOnly,
    update: customerDocOnly,
    create: () => true,
    delete: () => false,
  },

  hooks: {
    beforeChange: [setCustomerRole],
  },

  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: ['active', 'suspended', 'deleted'],
    },
    {
      name: 'evmAccount',
      type: 'relationship',
      relationTo: 'evm_smart_accounts',
    },
    {
      name: 'solWallet',
      type: 'relationship',
      relationTo: 'sol_server_wallets',
    },
  ],
}
