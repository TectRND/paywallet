import type { CollectionConfig } from 'payload';
import { customerOwnedOnly } from '../access';

export const SolServerWallets: CollectionConfig = {
  slug: 'sol_server_wallets',
  access: {
    read: customerOwnedOnly,
    create: customerOwnedOnly,
    update: customerOwnedOnly,
    delete: () => false
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true
    },
    {
      name: 'thirdwebWalletId',
      type: 'text',
      required: true
    },
    {
      name: 'publicKey',
      type: 'text',
      required: true
    },
    {
      name: 'network',
      type: 'text',
      required: true
    },
    {
      name: 'custodyMode',
      type: 'select',
      options: [{ label: 'Backend', value: 'backend' }],
      defaultValue: 'backend',
      required: true
    }
  ]
};
