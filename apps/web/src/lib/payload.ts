import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from 'payload-config'

export async function getPayloadClient() {
  return await getPayloadHMR({ config: configPromise })
}
