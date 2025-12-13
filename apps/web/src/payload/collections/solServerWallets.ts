import type { CollectionConfig } from 'payload'
import { customerOwnedOnly } from '../access/customerScope'

export const SolServerWallets: CollectionConfig = {
  slug: 'sol_server_wallets',
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
    { name: 'thirdwebWalletId', type: 'text', required: true, unique: true },
    { name: 'publicKey', type: 'text', required: true, unique: true },
    {
      name: 'network',
      type: 'select',
      required: true,
      defaultValue: 'solana:mainnet',
      options: ['solana:mainnet', 'solana:devnet'],
    },
    {
      name: 'custodyMode',
      type: 'select',
      required: true,
      defaultValue: 'backend',
      options: ['backend'],
    },
  ],
}
