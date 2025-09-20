// Docs: https://www.instantdb.com/docs/modeling-data
import { i } from '@instantdb/react'

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string()
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional()
    }),
    projects: i.entity({
      description: i.string().optional(),
      hourlyRate: i.number().optional(),
      ownerId: i.string().indexed(),
      title: i.string()
    }),
    reportedTimes: i.entity({
      projectId: i.string().indexed(),
      ownerId: i.string().indexed(),
      timerId: i.string().optional().indexed(), // Optional reference to the timer that created this report
      duration: i.number(), // Duration in milliseconds
      reportedAt: i.string().indexed(), // Date in YYYY-MM-DD format for grouping by day
      hourlyRate: i.number().optional(), // Project's hourly rate at the time of report creation
      createdAt: i.number() // Unix timestamp in milliseconds
    }),
    timers: i.entity({
      projectId: i.string().indexed(),
      ownerId: i.string().indexed(),
      startedAt: i.number(), // Unix timestamp in milliseconds when timer started
      pausedAt: i.number().optional(), // Unix timestamp in milliseconds when timer was paused (null if not paused)
      totalPausedTime: i.number().optional(), // Total time paused in milliseconds
      finishedAt: i.number().optional(), // Unix timestamp in milliseconds when timer finished (null if still running)
      createdAt: i.number() // Unix timestamp in milliseconds when record was created
    })
  },
  links: {
    projectsOwner: {
      forward: {
        on: 'projects',
        has: 'one',
        label: 'owner'
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'projects'
      }
    },
    reportedTimesProject: {
      forward: {
        on: 'reportedTimes',
        has: 'one',
        label: 'project'
      },
      reverse: {
        on: 'projects',
        has: 'many',
        label: 'reportedTimes'
      }
    },
    reportedTimesOwner: {
      forward: {
        on: 'reportedTimes',
        has: 'one',
        label: 'owner'
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'reportedTimes'
      }
    },
    timersProject: {
      forward: {
        on: 'timers',
        has: 'one',
        label: 'project'
      },
      reverse: {
        on: 'projects',
        has: 'many',
        label: 'timers'
      }
    },
    timersOwner: {
      forward: {
        on: 'timers',
        has: 'one',
        label: 'owner'
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'timers'
      }
    },
    reportedTimesTimer: {
      forward: {
        on: 'reportedTimes',
        has: 'one',
        label: 'timer'
      },
      reverse: {
        on: 'timers',
        has: 'one',
        label: 'reportedTime'
      }
    }
  },
  rooms: {}
})

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
