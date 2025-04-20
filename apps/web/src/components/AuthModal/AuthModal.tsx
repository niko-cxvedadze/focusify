import { useAtom } from "jotai";
import { authModalAtom } from "../../atoms/global.atoms";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Checkbox, Input, Link, Tabs, Tab } from "@heroui/react";

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
