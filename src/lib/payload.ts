import { getPayload } from 'payload'
import config from '@/payload.config'

/** Cached Payload Local API client for use in server components. */
export const getPayloadClient = async () => getPayload({ config: await config })
