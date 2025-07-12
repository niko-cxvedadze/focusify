import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'

import { CityOptions, LicenseCategoryOptions } from '@/config/global.config'

export function ClientView() {
  return (
    <div className="mt-6 flex h-full w-full justify-between gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <h1 className="text-4xl font-bold">იპოვე ინსტრუქტორი მარტივად</h1>
        <p className="text-lg">
          მართვის მოწმობის ინსტრუქტორის პოვნა ასე მარტივი არასდროს ყოფილა, უბრალოდ აირჩიე ქალაქი და
          კატეგორია, და დააკლიკე ძებნას.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Select label="აირჩიე ქალაქი">
          {CityOptions.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
        <Select label="აირჩიე კატეგორია">
          {LicenseCategoryOptions.map((category) => (
            <SelectItem key={category.key}>{category.label}</SelectItem>
          ))}
        </Select>
        <Button color="primary">ძებნა</Button>
      </div>
    </div>
  )
}
