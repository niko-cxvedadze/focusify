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
