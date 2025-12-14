import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access';

export const TokenAllowlist: CollectionConfig = {
  slug: 'token_allowlist',
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
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
