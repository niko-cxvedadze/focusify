import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderOpen, MoreHorizontal } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  color: 'blue' | 'green' | 'purple'
}

export function ProjectCard({ title, description, color }: ProjectCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      icon: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      icon: 'text-purple-600 dark:text-purple-400'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 ${colorClasses[color].bg} rounded-lg`}>
            <FolderOpen className={`h-4 w-4 ${colorClasses[color].icon}`} />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}