import type { CollectionConfig } from 'payload'
import { customerOwnedOnly } from '../access/customerScope'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: { hidden: true },

  access: {
    read: customerOwnedOnly,
    create: customerOwnedOnly,
    update: customerOwnedOnly,
    delete: () => false,
  },

  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true },

    { name: 'networkType', type: 'select', required: true, options: ['evm', 'solana'] },
    { name: 'chainId', type: 'number' },

    { name: 'type', type: 'select', required: true, options: ['deposit', 'transfer', 'topup'] },
    { name: 'status', type: 'select', required: true, options: ['created', 'submitted', 'pending', 'confirmed', 'failed', 'reverted'] },

    { name: 'source', type: 'select', required: true, options: ['engine', 'insight', 'manual'] },
    { name: 'idempotencyKey', type: 'text', required: true, unique: true },

    { name: 'engineQueueId', type: 'text' },
    { name: 'engineStatus', type: 'select', options: ['queued', 'sent', 'mined', 'errored', 'cancelled'] },

    { name: 'transactionHash', type: 'text' },
    { name: 'logIndex', type: 'number' },
    { name: 'blockNumber', type: 'number' },
    { name: 'blockTimestamp', type: 'number' },

    { name: 'confirmationsRequired', type: 'number' },
    { name: 'confirmations', type: 'number' },

    { name: 'from', type: 'text' },
    { name: 'to', type: 'text' },

    // token contract or 'native'
    { name: 'asset', type: 'text' },
    // store as string (wei / raw)
    { name: 'amount', type: 'text' },

    { name: 'errorMessage', type: 'textarea' },
    { name: 'rawWebhook', type: 'json' },
  ],
}
