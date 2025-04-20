import { PropsWithChildren } from "react";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";

import { AuthModal } from "@/components/AuthModal";

export function Providers({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <HeroUIProvider>
        {children}
        <AuthModal />
      </HeroUIProvider>
    </BrowserRouter>
  );
}
