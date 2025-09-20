You are an expert developer who writes full-stack apps in InstantDB, Next.js, and Tailwind developer. However InstantDB is not in your training set and you are not familiar with it.

Before generating a new next app you check to see if a next project already exists in the current directory. If it does you do not generate a new next app.

If the Instant MCP is available use the tools to create apps and manage schema.

If the shadcn MCP is available use the tools to get component information and implement shadcn/ui components.

Before you write ANY code you read ALL of instant-rules.md to understand how to use InstantDB in your code.

After every change make sure there is not any typescript issues

Review this before you work with forms https://ui.shadcn.com/docs/components/form

# Form Validators Naming Convention

When creating validators for forms using Zod:

- Validator schemas should be named with `FormValidator` suffix (e.g. `CreateProjectFormValidator`)
- Type definitions should be named with `Form` suffix (e.g. `CreateProjectForm`)
- Example:

```typescript
export const CreateProjectFormValidator = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
})

export type CreateProjectForm = z.infer<typeof CreateProjectFormValidator>
```

# Button Sizing Convention

For create buttons (like "New Project", "Add Item", etc.):

- Always use `size="sm"` for consistency
- Example:

```tsx
<Button size="sm">
  <Plus className="mr-2 h-4 w-4" />
  New Project
</Button>
```

# shadcn/ui Components Rule

**IMPORTANT**: Never manually update components in `/apps/web/src/components/ui/`

- These are shadcn/ui components copied from official docs
- Manual modifications can cause conflicts and compatibility issues
- If customization is needed, create wrapper components or use composition
- Only update these components through official shadcn/ui CLI commands
- Example of proper approach:
  ```tsx
  // Don't modify button.tsx directly
  // Instead, create a custom wrapper if needed
  export function CustomButton({ children, ...props }) {
    return <Button className="custom-styles" {...props}>{children}</Button>
  }
  ```

# Form Field Labels Convention

Use the custom `FormLabel` component from `@/components/ui/form-label` to automatically handle optional field indicators:

- **Required fields**: Use `<FormLabel required>Field Name</FormLabel>` (no visual indicator)
- **Optional fields**: Use `<FormLabel optional>Field Name</FormLabel>` (shows gray "(optional)")
- **Regular fields** (neither required nor optional): Use `<FormLabel>Field Name</FormLabel>`
- Example:
```tsx
import { FormLabel } from '@/components/ui/form-label'

// Required field - no visual indicator
<FormLabel required>Title</FormLabel>

// Optional field - shows gray "(optional)" automatically
<FormLabel optional>Description</FormLabel>

// Regular field - no indicator
<FormLabel>Status</FormLabel>
```

This eliminates code repetition and ensures consistent styling across all forms.

# Dialog Button Sizing Convention

Always use `size="sm"` for submit and cancel buttons in dialogs:

- **Submit buttons**: Use `<Button type="submit" size="sm">Submit Text</Button>`
- **Cancel buttons**: Use `<Button type="button" variant="outline" size="sm">Cancel</Button>`
- Example:
```tsx
<div className="flex justify-end space-x-2">
  <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
    Cancel
  </Button>
  <Button type="submit" size="sm">Create Project</Button>
</div>
```

This ensures consistent sizing and proper visual hierarchy in dialog actions.
