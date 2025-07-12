import { useState } from 'react'

import { Button } from '@heroui/button'
import { DatePicker } from '@heroui/date-picker'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { CalendarDate } from '@internationalized/date'
import { HiMagnifyingGlass } from 'react-icons/hi2'

import { CityOptions, LanguageOptions, LicenseCategoryOptions } from '@/config/global.config'

export function ClientFitlers() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // Time options for the day
  const TimeOptions = Array.from({ length: 24 }, (_, i) => ({
    key: i.toString().padStart(2, '0'),
    label: `${i.toString().padStart(2, '0')}:00`
  }))

  return (
    <div className="w-full bg-background shadow-small rounded-md p-4">
      <div className="flex w-full gap-4">
        <Select color="primary" label="აირჩიე ქალაქი" required size="sm" variant="faded">
          {CityOptions.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
        <Select color="primary" label="აირჩიე კატეგორია" size="sm" variant="faded">
          {LicenseCategoryOptions.map((category) => (
            <SelectItem key={category.key}>{category.label}</SelectItem>
          ))}
        </Select>
        <Select color="primary" label="აირჩიე ენა" size="sm" variant="faded">
          {LanguageOptions.map((language) => (
            <SelectItem key={language.key}>{language.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex w-full gap-4 mt-4">
        <DatePicker
          color="primary"
          label="აირჩიე თარიღი"
          size="sm"
          variant="faded"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        <Select
          color="primary"
          label="აირჩიე საათი"
          size="sm"
          variant="faded"
          selectedKeys={selectedTime ? [selectedTime] : []}
          onSelectionChange={(keys) => setSelectedTime(Array.from(keys)[0] as string)}
        >
          {TimeOptions.map((time) => (
            <SelectItem key={time.key}>{time.label}</SelectItem>
          ))}
        </Select>
        <Input
          color="primary"
          label="ძებნა"
          placeholder="შეიყვანე საძიებო სიტყვა"
          size="sm"
          variant="faded"
          value={searchKeyword}
          onValueChange={setSearchKeyword}
        />
      </div>
      <div className="flex w-full justify-end gap-4 mt-4">
        <Button color="primary" startContent={<HiMagnifyingGlass />}>
          ძებნა
        </Button>
      </div>
    </div>
  )
}
