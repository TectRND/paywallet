import { handlePayloadRequests } from '@payloadcms/next/handlers'

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS } = handlePayloadRequests()
