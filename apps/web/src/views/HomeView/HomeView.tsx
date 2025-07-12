import { ClientFitlers } from '@/components/ClientFilters'
import { InstructorCarousel } from '@/components/InstructorCarousel'

export function HomeView() {
  return (
    <div className="w-full mt-6">
      <ClientFitlers />
      <InstructorCarousel className="mt-6" />
    </div>
  )
}
