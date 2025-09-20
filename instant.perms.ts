// Docs: https://www.instantdb.com/docs/permissions
import type { InstantRules } from '@instantdb/react'

const rules = {
  projects: {
    bind: [
      'isOwner',
      'auth.id != null && auth.id == data.ownerId',
      'isAuthenticated',
      'auth.id != null'
    ],
    allow: {
      view: 'isOwner',
      create: 'isAuthenticated',
      delete: 'isOwner',
      update: 'isOwner'
    }
  }
} satisfies InstantRules

export default rules
