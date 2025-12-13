import type { GlobalConfig } from 'payload';

export const EngineSettings: GlobalConfig = {
  slug: 'engine_settings',
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user)
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
