import { Chip } from '@heroui/react'
import { Rating } from 'react-simple-star-rating'

export function InstructorListCard() {
  const rating = 4.5 // Sample rating value

  // Sample pricing structure - can be expanded
  const pricing = {
    B: { city: 25, square: 20 },
    B1: { city: 30, square: 25 }
  }

  return (
    <div className="cursor-pointer rounded-md p-4 bg-background shadow-small flex flex-row gap-4 hover:border-primary border-2 border-transparent hover:border-2 transition-all duration-300">
      <div className="w-1/3 rounded-md overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="https://randomuser.me/api/portraits/men/33.jpg"
          alt="instructor"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg leading-none font-bold">ნიკა ბარათლიძე</h3>
        <p className=" text-gray-500 leading-none">თბილისი</p>
        <div className="flex items-center gap-2">
          <Rating
            readonly
            allowFraction
            size={16}
            fillColor="#fbbf24"
            initialValue={rating}
            emptyColor="#d1d5db"
            className="flex star-rating-container"
          />
          <span className="text-sm text-gray-600">({rating})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <Chip size="sm" color="primary" variant="flat">
            🇬🇪 ქართული
          </Chip>
          <Chip size="sm" color="primary" variant="flat">
            🇺🇸 English
          </Chip>
          <Chip size="sm" color="primary" variant="flat">
            🇷🇺 Русский
          </Chip>
        </div>
        <div className="flex flex-wrap gap-1">
          <Chip size="sm" color="secondary" variant="flat">
            B (მექანიკა)
          </Chip>
          <Chip size="sm" color="secondary" variant="flat">
            B1 (ავტომატიკა)
          </Chip>
        </div>
        <div className="flex items-end gap-3 flex-grow">
          <div className="flex flex-col gap-1">
            {Object.entries(pricing).map(([category, prices]) => (
              <div key={category}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">{category}:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">ქალაქი</span>
                    <span className="text-sm font-bold text-green-600">{prices.city}₾</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">მოედანი</span>
                    <span className="text-sm font-bold text-green-600">{prices.square}₾</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
