import { ClientFitlers } from '@/components/ClientFilters'
import { InstructorCardsRow } from '@/components/InstructorCards'

export function ClientView() {
  return (
    <div className="w-full mt-6">
      <ClientFitlers />
      <InstructorCardsRow className="mt-6" />
    </div>
  )
}
