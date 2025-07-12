import { Button } from '@heroui/button'
import { useAtom } from 'jotai'

import { authModalAtom } from '../../atoms/global.atoms'

export function Header() {
  const [isOpen, setIsOpen] = useAtom(authModalAtom)

  return (
    <div className="border-b-divider w-full border-b py-3">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6">
        <h1 className="font-bold">alldrive.ge</h1>
        <div className="flex gap-2">
          <Button variant="faded" onPress={() => setIsOpen(true)}>
            შესვლა
          </Button>
        </div>
      </div>
    </div>
  )
}
