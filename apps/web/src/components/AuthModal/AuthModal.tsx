import { useAtom } from "jotai";
import { authModalAtom } from "../../atoms/global.atoms";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  Tabs,
  Tab,
} from "@heroui/react";

export function AuthModal() {
  const [isOpen, setIsOpen] = useAtom(authModalAtom);

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={(value) => setIsOpen(value)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">გაიარე ავტორიზაცია</ModalHeader>
            <ModalBody>
              <Tabs
                className="'w-full"
                classNames={{ tabList: "w-full" }}
                aria-label="Tabs variants"
                variant={"underlined"}
              >
                <Tab key="photos" title="შესვლა" className="w-full" />
                <Tab key="music" title="რეგისტრაცია" className="w-full" />
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function LoginForm() {
    return (
      <div>
        <Input label="ელ-ფოსტა" placeholder="შეიყვანე თქვენი ელ-ფოსტა" variant="bordered" />
        <Input label="პაროლი" placeholder="შეიყვანე თქვენი პაროლი" type="password" variant="bordered" />
        <div className="flex justify-between px-1 py-1">
          <Checkbox
            classNames={{
              label: "text-small",
            }}
          >
            დამიმახსოვრე
          </Checkbox>
          <Link color="primary" href="#" size="sm">
            დაგავიწყდა პაროლი?
          </Link>
        </div>
        <Button color="primary" size="lg">
          შესვლა
        </Button>
      </div>
    );
}
