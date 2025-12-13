import type { CollectionConfig } from 'payload';

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
    create: () => true
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [{ label: 'Customer', value: 'customer' }],
      required: true,
      access: {
        update: () => false
      }
    },
    {
      name: 'evmAccount',
      type: 'relationship',
      relationTo: 'evm_smart_accounts',
      required: false
    },
    {
      name: 'solWallet',
      type: 'relationship',
      relationTo: 'sol_server_wallets',
      required: false
    }
  ]
};
