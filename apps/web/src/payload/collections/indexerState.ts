import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const IndexerState: CollectionConfig = {
  slug: 'indexer_state',

  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  fields: [
    { name: 'chainId', type: 'number', required: true, unique: true },
    // unix seconds
    { name: 'lastBlockTimestamp', type: 'number', required: true, defaultValue: 0 },
  ],
}
