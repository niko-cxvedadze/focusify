import { init } from '@instantdb/react'

import type { AppSchema } from '../../../../instant.schema'

// Your InstantDB app ID
const APP_ID = '074ecaa6-a4fb-4d04-91e0-1c31491a65b0'

// Initialize InstantDB with schema for better TypeScript support
export const db = init<AppSchema>({ appId: APP_ID })
