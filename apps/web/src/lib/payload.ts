import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from 'payload-config';

export async function getPayloadClient() {
  const payload = await getPayloadHMR({ config: configPromise });
  return payload;
}
