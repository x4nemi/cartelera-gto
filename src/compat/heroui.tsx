/**
 * HeroUI v2 → v3 compatibility shims.
 *
 * Re-exports/wraps v3 primitives under the v2 names and shapes the codebase still uses.
 * This lets most call sites migrate by changing only the import path, while the actual
 * v3-native rewrites happen incrementally.
 *
 * NOTE: shims are intentionally permissive with types. Where v2 props no longer exist
 * in v3 (e.g. Card `shadow`, `isPressable`; Modal `backdrop`, `scrollBehavior`), the
 * shims silently drop them. Migrate to v3-native patterns for fine-grained control.
 */

import type { ImgHTMLAttributes, ReactElement, ReactNode } from "react";
import * as React from "react";

import {
  Avatar as V3Avatar,
  Button as V3Button,
  Card as V3Card,
  Drawer as V3Drawer,
  Modal as V3Modal,
  TextArea as V3TextArea,
  Tooltip as V3Tooltip,
  Separator,
  useOverlayState,
  type UseOverlayStateReturn,
} from "@heroui/react";
import { createContext, useContext, useMemo } from "react";

// ────────────────────────────────────────────────────────────────────────────
// addToast (v2 named export) → moved into utils/toast
export { addToast } from "@/utils/toast";

// ────────────────────────────────────────────────────────────────────────────
// Pure renames
export { CardContent as CardBody, CardHeader } from "@heroui/react";
export { Separator as Divider } from "@heroui/react";
export const Textarea = V3TextArea;

// ────────────────────────────────────────────────────────────────────────────
// useDisclosure → useOverlayState adapter
export interface UseDisclosureProps {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureReturn {
  const state = useOverlayState(props);

  return useMemo(
    () => ({
      isOpen: state.isOpen,
      onOpen: state.open,
      onClose: state.close,
      onOpenChange: state.setOpen,
    }),
    [state],
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Image (removed in v3) → native <img>
export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> {
  src?: string;
  alt?: string;
  className?: string;
  /** v2 props silently dropped: removeWrapper, isZoomed, isBlurred, classNames, radius */
  removeWrapper?: boolean;
  isZoomed?: boolean;
  isBlurred?: boolean;
  radius?: string;
  classNames?: { wrapper?: string; img?: string };
  loading?: "lazy" | "eager";
}

export function Image({
  src,
  alt = "",
  className,
  removeWrapper: _r,
  isZoomed: _z,
  isBlurred: _b,
  radius: _ra,
  classNames,
  loading = "lazy",
  ...rest
}: ImageProps) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return (
    <img
      alt={alt}
      className={[className, classNames?.img].filter(Boolean).join(" ")}
      loading={loading}
      src={src}
      {...rest}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// User (removed in v3) → Avatar + name/description composition
export interface UserProps {
  name?: ReactNode;
  description?: ReactNode;
  avatarProps?: { src?: string; size?: "sm" | "md" | "lg"; className?: string };
  className?: string;
  classNames?: { base?: string; wrapper?: string; name?: string; description?: string };
}

export function User({
  name,
  description,
  avatarProps,
  className,
  classNames,
}: UserProps) {
  const initials = typeof name === "string"
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={[
        "inline-flex items-center gap-3",
        className,
        classNames?.base,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <V3Avatar size={avatarProps?.size} className={avatarProps?.className}>
        {avatarProps?.src ? <V3Avatar.Image src={avatarProps.src} alt={typeof name === "string" ? name : ""} /> : null}
        <V3Avatar.Fallback>{initials}</V3Avatar.Fallback>
      </V3Avatar>
      <div
        className={[
          "flex flex-col leading-tight",
          classNames?.wrapper,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {name ? <span className={classNames?.name}>{name}</span> : null}
        {description ? (
          <span
            className={["text-sm text-foreground/60", classNames?.description]
              .filter(Boolean)
              .join(" ")}
          >
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Avatar (compat): allow v2 `src` + `size` flat props
export interface AvatarShimProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}

export function Avatar({ src, alt, name, size, className, children }: AvatarShimProps) {
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
  return (
    <V3Avatar size={size} className={className}>
      {src ? <V3Avatar.Image src={src} alt={alt ?? name ?? ""} /> : null}
      <V3Avatar.Fallback>{children ?? initials}</V3Avatar.Fallback>
    </V3Avatar>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Card compat: accept v2 `shadow`, `isPressable`, `onClick`/`onPress`
export interface CardShimProps {
  children?: ReactNode;
  className?: string;
  shadow?: string;
  isPressable?: boolean;
  isHoverable?: boolean;
  onPress?: () => void;
  onClick?: () => void;
  variant?: "default" | "secondary" | "tertiary" | "transparent";
}

export function Card({
  children,
  className,
  isPressable,
  onPress,
  onClick,
  variant,
  shadow: _shadow,
  isHoverable: _ih,
  ...rest
}: CardShimProps & Record<string, unknown>) {
  const handler = onPress ?? onClick;
  if (isPressable && handler) {
    return (
      <V3Card
        className={[
          className,
          "cursor-pointer text-left transition-transform active:scale-[0.98]",
        ]
          .filter(Boolean)
          .join(" ")}
        render={((props: React.JSX.IntrinsicElements["div"]) => (
          <button
            type="button"
            {...(props as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              (props as unknown as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
              handler();
            }}
          />
        )) as unknown as React.ComponentProps<typeof V3Card>["render"]}
        variant={variant}
        {...rest}
      >
        {children}
      </V3Card>
    );
  }
  return (
    <V3Card className={className} variant={variant} {...rest}>
      {children}
    </V3Card>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Modal v2-compat: takes `isOpen`/`onOpenChange`/`backdrop`/`size`/`scrollBehavior`
// and exposes `ModalContent` with the legacy render-prop `(onClose) => …` pattern.

const ModalOnCloseContext = createContext<() => void>(() => {});

export interface ModalShimProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  backdrop?: "transparent" | "opaque" | "blur";
  size?:
    | "xs" | "sm" | "md" | "lg" | "xl"
    | "2xl" | "3xl" | "4xl" | "5xl"
    | "full" | "cover";
  scrollBehavior?: "normal" | "inside" | "outside";
  placement?: "auto" | "top" | "center" | "bottom";
  isDismissable?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onOpenChange,
  backdrop,
  size,
  scrollBehavior,
  placement,
  isDismissable,
  className,
  children,
}: ModalShimProps) {
  const state = useOverlayState({ isOpen, onOpenChange });

  // Map v2 size strings to v3 supported sizes (xs|sm|md|lg|full|cover).
  const v3Size: "xs" | "sm" | "md" | "lg" | "full" | "cover" | undefined =
    size == null
      ? undefined
      : size === "xs" || size === "sm" || size === "md" || size === "lg" ||
          size === "full" || size === "cover"
        ? size
        : size === "xl"
          ? "lg"
          : "cover"; // 2xl/3xl/4xl/5xl → cover

  return (
    <V3Modal state={state}>
      <V3Modal.Backdrop
        isDismissable={isDismissable}
        variant={backdrop === "blur" ? "blur" : undefined}
      >
        <V3Modal.Container
          className={className}
          placement={placement}
          scroll={scrollBehavior === "inside" ? "inside" : undefined}
          size={v3Size}
        >
          <V3Modal.Dialog>
            <ModalOnCloseContext.Provider value={state.close}>
              {children}
            </ModalOnCloseContext.Provider>
          </V3Modal.Dialog>
        </V3Modal.Container>
      </V3Modal.Backdrop>
    </V3Modal>
  );
}

export interface ModalContentProps {
  children: ReactNode | ((onClose: () => void) => ReactNode);
}

export function ModalContent({ children }: ModalContentProps): ReactElement {
  const onClose = useContext(ModalOnCloseContext);

  return <>{typeof children === "function" ? children(onClose) : children}</>;
}

export const ModalHeader = V3Modal.Header;
export const ModalBody = V3Modal.Body;
export const ModalFooter = V3Modal.Footer;

// ────────────────────────────────────────────────────────────────────────────
// Button shim — silently drops `color` and `radius` (no v3 equivalents on Button).
type V3ButtonProps = React.ComponentPropsWithRef<typeof V3Button>;
export interface ButtonShimProps
  extends Omit<V3ButtonProps, "color"> {
  color?: string;
  radius?: string;
}

export function Button({ color: _c, radius: _r, ...props }: ButtonShimProps) {
  return <V3Button {...(props as V3ButtonProps)} />;
}

// ────────────────────────────────────────────────────────────────────────────
// Tooltip shim — accepts v2 `content` prop, wrapping children with v3 trigger+content.
export interface TooltipShimProps {
  children: ReactNode;
  content?: ReactNode;
  placement?: string;
  delay?: number;
  closeDelay?: number;
  className?: string;
  isDisabled?: boolean;
}

export function Tooltip({
  children,
  content,
  className,
  isDisabled,
  delay: _d,
  closeDelay: _cd,
  placement: _p,
}: TooltipShimProps) {
  if (isDisabled || content == null) return <>{children}</>;
  return (
    <V3Tooltip>
      <V3Tooltip.Trigger>{children as React.ReactElement}</V3Tooltip.Trigger>
      <V3Tooltip.Content className={className}>{content}</V3Tooltip.Content>
    </V3Tooltip>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Drawer v2-compat: takes `isOpen`/`onOpenChange`/`backdrop`/`size`/`placement`
// and exposes `DrawerContent` with v2 render-prop `(onClose) => …` pattern.
const DrawerOnCloseContext = createContext<() => void>(() => {});

export interface DrawerShimProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  backdrop?: "transparent" | "opaque" | "blur";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  placement?: "top" | "bottom" | "left" | "right";
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  className?: string;
  classNames?: { base?: string; backdrop?: string; wrapper?: string };
  children: ReactNode;
}

const DrawerConfigContext = createContext<{
  size?: DrawerShimProps["size"];
  placement?: DrawerShimProps["placement"];
  className?: string;
  classNames?: DrawerShimProps["classNames"];
  backdrop?: DrawerShimProps["backdrop"];
  isDismissable?: boolean;
}>({});

export function Drawer({
  isOpen,
  onOpenChange,
  backdrop,
  size,
  placement = "right",
  isDismissable,
  className,
  classNames,
  children,
}: DrawerShimProps) {
  const state = useOverlayState({ isOpen, onOpenChange });
  const config = useMemo(
    () => ({ size, placement, className, classNames, backdrop, isDismissable }),
    [size, placement, className, classNames, backdrop, isDismissable],
  );

  return (
    <DrawerConfigContext.Provider value={config}>
      <DrawerOnCloseContext.Provider value={state.close}>
        <V3Drawer state={state}>{children}</V3Drawer>
      </DrawerOnCloseContext.Provider>
    </DrawerConfigContext.Provider>
  );
}

export interface DrawerContentProps {
  children: ReactNode | ((onClose: () => void) => ReactNode);
}

export function DrawerContent({ children }: DrawerContentProps): ReactElement {
  const cfg = useContext(DrawerConfigContext);
  const onClose = useContext(DrawerOnCloseContext);

  return (
    <V3Drawer.Backdrop
      variant={cfg.backdrop === "blur" ? "blur" : undefined}
      className={cfg.classNames?.backdrop}
    >
      <V3Drawer.Content
        placement={cfg.placement}
        className={[cfg.classNames?.base, cfg.className]
          .filter(Boolean)
          .join(" ")}
      >
        <V3Drawer.Dialog>
          {typeof children === "function" ? children(onClose) : children}
        </V3Drawer.Dialog>
      </V3Drawer.Content>
    </V3Drawer.Backdrop>
  );
}

export const DrawerHeader = V3Drawer.Header;
export const DrawerBody = V3Drawer.Body;
export const DrawerFooter = V3Drawer.Footer;

// ────────────────────────────────────────────────────────────────────────────
// Re-export Separator under both names so files using `Separator` keep working too
export { Separator };

// Reference UseOverlayStateReturn so the import isn't pruned (used by tooling later)
export type { UseOverlayStateReturn };
