import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { ToastProvider } from "@heroui/react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref} locale="es-MX">
      <ToastProvider
        placement={isDesktop ? "bottom-right" : "top-center"}
        toastOffset={16}
        toastProps={{
          radius: "full",
          variant: "flat",
          classNames: {
            base: "rounded-3xl border border-default bg-content1/90 backdrop-blur-md shadow-lg px-4 py-3",
            title: "font-semibold",
            description: "text-sm text-default-600",
            closeButton: "rounded-full",
          },
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
