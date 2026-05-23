import { FC, useEffect, useState } from "react";
import { useTheme } from "@heroui/react";
import clsx from "clsx";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const metaThemeColor = document.getElementById("meta-theme-color") as
      | HTMLMetaElement
      | null;
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "light" ? "#C8E2FB" : "#000000",
      );
    }

    const htmlElement = document.querySelectorAll(
      "apple-mobile-web-app-status-bar-style, meta[name='theme-color']",
    );
    htmlElement.forEach((element) => {
      element.setAttribute(
        "content",
        theme === "light" ? "#C8E2FB" : "#000000",
      );
    });
  }, [theme]);

  if (!isMounted) return <div className="w-6 h-6" />;

  const isLight = theme === "light";

  return (
    <button
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={clsx(
        "px-px py-px text-default-500 transition-opacity hover:opacity-80 cursor-pointer",
        className,
      )}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      type="button"
    >
      {isLight ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
    </button>
  );
};
