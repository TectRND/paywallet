import type { CollectionConfig } from 'payload/types';

export const TokenAllowlist: CollectionConfig = {
  slug: 'token_allowlist',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user)
  },
  fields: [
    {
      name: 'chainId',
      type: 'number',
      required: true
    },
    {
      name: 'symbol',
      type: 'text',
      required: true
    },
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'contractAddress',
      type: 'text',
      required: true
    },
    {
      name: 'decimals',
      type: 'number',
      required: true
    },
    {
      name: 'confirmationsRequired',
      type: 'number',
      required: true
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true
    }
  ]
};
