import { Button } from '@heroui/button'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router'

import { authModalAtom } from '../../atoms/global.atoms'

export function Header() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useAtom(authModalAtom)

  return (
    <div className="border-b-divider w-full border-b py-3 bg-background">
      <div className="container flex w-full items-center justify-between">
        <h1 className="font-bold cursor-pointer" onClick={() => navigate('/')}>
          alldrive.ge
        </h1>
        <div className="flex gap-2">
          <Button variant="faded" onPress={() => setIsOpen(true)}>
            შესვლა
          </Button>
        </div>
      </div>
    </div>
  )
}
