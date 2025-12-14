import type { CollectionConfig } from 'payload';
import { customerDocOnly, isAdmin } from '../access';

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  hooks: {
    beforeChange: [({ data }) => ({ ...data, role: 'customer' })]
  },
  access: {
    read: customerDocOnly,
    update: customerDocOnly,
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
        create: () => false,
        read: ({ req }) => req.user?.collection === 'admins',
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
