import type { CollectionConfig } from 'payload/types';

export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: true,
  access: {
    read: () => true,
    update: () => true,
    delete: () => true,
    create: () => true
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Ops', value: 'ops' },
        { label: 'Support', value: 'support' }
      ],
      required: true
    }
  ]
};
