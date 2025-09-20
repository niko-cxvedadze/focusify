import { Button } from '@heroui/button'
import { useNavigate } from 'react-router'

export function Header() {
  const navigate = useNavigate()

  return (
    <div className="border-b-divider w-full border-b py-3 bg-background">
      <div className="container flex w-full items-center justify-between">
        <h1 className="font-bold cursor-pointer" onClick={() => navigate('/')}>
          Starter Kit
        </h1>
        <div className="flex gap-2">
          <Button variant="faded">
            Button
          </Button>
        </div>
      </div>
    </div>
  )
}
