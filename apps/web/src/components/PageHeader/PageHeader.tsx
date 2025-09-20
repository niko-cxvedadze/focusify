import React from 'react'

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4 py-2">
      <div>
        <h1 className="font-bold tracking-tight">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-4">{children}</div>}
    </div>
  )
}
