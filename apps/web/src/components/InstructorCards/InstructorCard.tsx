import { Divider } from '@heroui/react'
import { Chip } from '@heroui/react'

interface InstructorCardProps {
  imageUrl?: string
  fullName?: string
  location?: string
  categories?: string[]
}

export function InstructorCard({
  imageUrl = 'https://randomuser.me/api/portraits/men/32.jpg',
  fullName = 'გიორგი ბერიძე',
  location = 'თბილისი',
  categories = ['B (მექანიკა)', 'B1 (ავტომატიკა)']
}: InstructorCardProps) {
  return (
    <div className="rounded-md bg-background cursor-pointer border-divider border shadow-sm w-full p-0 overflow-hidden flex flex-col">
      {/* Full-width image */}
      <div className="w-full h-40 bg-background border-b border-divider overflow-hidden">
        <img src={imageUrl} alt={fullName} className="object-cover w-full h-full" />
      </div>
      {/* Text section */}
      <div className="flex flex-col items-start p-2">
        <div className="flex items-center gap-2 text-gray-500 text-sm">{location}</div>
        <div className="text-left w-full">{fullName}</div>
      </div>
      {/* Divider */}
      <Divider />
      {/* Badges row */}
      <div className="flex flex-row gap-2 p-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <Chip key={cat} radius="sm" color="primary" variant="bordered" size="sm" children={cat} />
        ))}
      </div>
    </div>
  )
}
