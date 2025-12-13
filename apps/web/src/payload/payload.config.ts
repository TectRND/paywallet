import path from 'path';
import { buildConfig } from 'payload/config';
import { fileURLToPath } from 'url';
import { Admins } from './collections/admins';
import { Customers } from './collections/customers';
import { EvmSmartAccounts } from './collections/evmSmartAccounts';
import { SolServerWallets } from './collections/solServerWallets';
import { Transactions } from './collections/transactions';
import { TokenAllowlist } from './collections/tokenAllowlist';
import { IndexerState } from './collections/indexerState';
import { EngineSettings } from './globals/engineSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'admins'
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: [
    Admins,
    Customers,
    EvmSmartAccounts,
    SolServerWallets,
    Transactions,
    TokenAllowlist,
    IndexerState
  ],
  globals: [EngineSettings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  graphQL: {
    disable: false
  }
});
