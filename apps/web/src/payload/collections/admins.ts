import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access';

export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: true,
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    create: isAdmin
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
