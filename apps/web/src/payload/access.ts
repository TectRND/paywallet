import type { Access, FieldAccess } from 'payload';

export const isAdmin: Access = ({ req }) => req.user?.collection === 'admins';

export const customerDocOnly: Access = ({ req, id }) => {
  const user = req.user;
  if (!user) return false;
  if (user.collection === 'admins') return true;
  if (user.collection !== 'customers') return false;
  if (typeof id === 'string') {
    return user.id === id;
  }
  return { id: { equals: user.id } };
};

export const customerOwnedOnly: Access = ({ req, data }) => {
  const user = req.user;
  if (!user) return false;
  if (user.collection === 'admins') return true;
  if (user.collection !== 'customers') return false;
  if (data && typeof data === 'object' && 'customer' in data) {
    return data.customer === user.id;
  }
  return { customer: { equals: user.id } };
};

export const preventRoleChange: FieldAccess = ({ data }) => {
  if (data && 'role' in data) {
    return false;
  }
  return true;
};
