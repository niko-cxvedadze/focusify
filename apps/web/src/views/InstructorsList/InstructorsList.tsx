import { Pagination } from '@heroui/pagination'

import { ClientFitlers } from '@/components/ClientFilters'
import { InstructorListCard } from '@/components/InstructorListCard'

export function InstructorsList() {
  return (
    <div className="w-full mt-6">
      <ClientFitlers />
      <div className="grid grid-cols-2 gap-4 my-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <InstructorListCard key={index} />
        ))}
      </div>
      <div className="w-full bg-background p-4 flex justify-center shadow-small rounded-md mb-6">
        <Pagination
          total={50}
          initialPage={1}
          page={1}
          showControls
          color="primary"
          variant="light"
        />
      </div>
    </div>
  )
}
