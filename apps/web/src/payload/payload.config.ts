import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

import { Admins } from './collections/admins'
import { Customers } from './collections/customers'
import { EvmSmartAccounts } from './collections/evmSmartAccounts'
import { SolServerWallets } from './collections/solServerWallets'
import { Transactions } from './collections/transactions'
import { TokenAllowlist } from './collections/tokenAllowlist'
import { IndexerState } from './collections/indexerState'
import { EngineSettings } from './globals/engineSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  // Critical: only admins can access Payload Admin UI
  admin: {
    user: 'admins',
  },

  collections: [
    Admins,
    Customers,
    EvmSmartAccounts,
    SolServerWallets,
    Transactions,
    TokenAllowlist,
    IndexerState,
  ],

  globals: [EngineSettings],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
