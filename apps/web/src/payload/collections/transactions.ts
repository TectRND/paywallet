import type { CollectionConfig } from 'payload';
import { customerOwnedOnly, isAdmin } from '../access';

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    read: customerOwnedOnly,
    create: customerOwnedOnly,
    update: customerOwnedOnly,
    delete: isAdmin
  },
  admin: {
    defaultColumns: ['customer', 'type', 'status', 'chainId']
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true
    },
    {
      name: 'networkType',
      type: 'select',
      options: [
        { label: 'EVM', value: 'evm' },
        { label: 'Solana', value: 'solana' }
      ],
      required: true
    },
    {
      name: 'chainId',
      type: 'number',
      required: true
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Deposit', value: 'deposit' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'Topup', value: 'topup' }
      ],
      required: true
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Reverted', value: 'reverted' }
      ],
      defaultValue: 'pending',
      required: true
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Engine', value: 'engine' },
        { label: 'Insight', value: 'insight' }
      ],
      required: true
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'transactionHash',
      type: 'text'
    },
    {
      name: 'logIndex',
      type: 'number'
    },
    {
      name: 'blockNumber',
      type: 'number'
    },
    {
      name: 'blockTimestamp',
      type: 'date'
    },
    {
      name: 'confirmations',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'confirmationsRequired',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'from',
      type: 'text'
    },
    {
      name: 'to',
      type: 'text'
    },
    {
      name: 'asset',
      type: 'text'
    },
    {
      name: 'amount',
      type: 'text'
    },
    {
      name: 'rawWebhook',
      type: 'json'
    }
  ]
};
