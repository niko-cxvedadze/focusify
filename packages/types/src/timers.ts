import { InstaQLEntity } from '@instantdb/react'
import type { AppSchema } from '../../../instant.schema'

export type Timer = InstaQLEntity<AppSchema, 'timers'>
export type ReportedTime = InstaQLEntity<AppSchema, 'reportedTimes'>