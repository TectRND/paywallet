import type { CollectionConfig } from 'payload';
import { customerOwnedOnly } from '../access';

export const EvmSmartAccounts: CollectionConfig = {
  slug: 'evm_smart_accounts',
  access: {
    read: customerOwnedOnly,
    create: customerOwnedOnly,
    update: customerOwnedOnly,
    delete: () => false
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true
    },
    {
      name: 'smartAccountAddress',
      type: 'text',
      required: true
    },
    {
      name: 'salt',
      type: 'text',
      required: true
    },
    {
      name: 'factoryAddress',
      type: 'text',
      required: true
    },
    {
      name: 'adminAddress',
      type: 'text',
      required: true
    },
    {
      name: 'supportedChainIds',
      type: 'json'
    },
    {
      name: 'custodyMode',
      type: 'select',
      options: [{ label: 'Backend', value: 'backend' }],
      defaultValue: 'backend',
      required: true
    }
  ]
};
