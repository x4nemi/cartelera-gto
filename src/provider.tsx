import type { NavigateOptions } from "react-router-dom";

import { I18nProvider, RouterProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";

import { useMediaQuery } from "@/hooks/useMediaQuery";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <I18nProvider locale="es-MX">
      <RouterProvider navigate={navigate} useHref={useHref}>
        {children}
        <ToastProvider
          placement={isDesktop ? "bottom" : "top"}
        />
      </RouterProvider>
    </I18nProvider>
  );
}

