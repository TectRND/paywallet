import type { GlobalConfig } from 'payload';
import { isAdmin } from '../access';

export const EngineSettings: GlobalConfig = {
  slug: 'engine_settings',
  access: {
    read: isAdmin,
    update: isAdmin
  },
  fields: [
    {
      name: 'engineUrl',
      type: 'text',
      required: true
    },
    {
      name: 'engineAccessToken',
      type: 'text',
      required: true
    },
    {
      name: 'backendWalletAddress',
      type: 'text',
      required: true
    },
    {
      name: 'accountFactories',
      type: 'array',
      fields: [
        { name: 'chainId', type: 'number', required: true },
        { name: 'factoryAddress', type: 'text', required: true }
      ]
    },
    {
      name: 'rpcUrls',
      type: 'array',
      fields: [
        { name: 'chainId', type: 'number', required: true },
        { name: 'rpcUrl', type: 'text', required: true }
      ]
    }
  ]
};
