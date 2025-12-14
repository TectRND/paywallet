import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access';

export const IndexerState: CollectionConfig = {
  slug: 'indexer_state',
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
      name: 'lastBlockTimestamp',
      type: 'date'
    }
  ]
};
