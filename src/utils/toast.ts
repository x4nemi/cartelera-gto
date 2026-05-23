import type { ReactNode } from "react";

import { toast as v3toast } from "@heroui/react";

/**
 * Backwards-compatible adapter that maps the v2 `addToast({ title, description, color, ... })` shape
 * onto HeroUI v3's `toast(message, options)` API. Lets us migrate call sites incrementally.
 */

type LegacyColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type V3Variant = "default" | "accent" | "success" | "warning" | "danger";

const colorToVariant: Record<LegacyColor, V3Variant> = {
  default: "default",
  primary: "accent",
  secondary: "default",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export interface AddToastArgs {
  title?: ReactNode;
  description?: ReactNode;
  color?: LegacyColor;
  /** v2 visual variant — ignored in v3 (no longer per-toast). */
  variant?: string;
  /** v2 size — ignored in v3. */
  size?: string;
  timeout?: number;
  /** v2 classNames bag — ignored in v3; style globally via `.toast` BEM classes. */
  classNames?: Record<string, string>;
  /** v2 closeIcon — ignored in v3 (CloseButton renders its own). */
  closeIcon?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
}

export function addToast({
  title,
  description,
  color,
  timeout,
  icon,
  onClose,
}: AddToastArgs): string {
  return v3toast(title ?? "", {
    description,
    variant: color ? colorToVariant[color] : undefined,
    indicator: icon,
    timeout,
    onClose,
  });
}
