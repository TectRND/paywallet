import type { CollectionConfig } from 'payload';

export const IndexerState: CollectionConfig = {
  slug: 'indexer_state',
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
      name: 'lastBlockTimestamp',
      type: 'date'
    }
  ]
};
