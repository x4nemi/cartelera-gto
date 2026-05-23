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
  Accordion as V3Accordion,
  Button as V3Button,
  Calendar as V3Calendar,
  Card as V3Card,
  Checkbox as V3Checkbox,
  Chip as V3Chip,
  DatePicker as V3DatePicker,
  Drawer as V3Drawer,
  Dropdown as V3Dropdown,
  Input as V3Input,
  Link as V3Link,
  Alert as V3Alert,
  Modal as V3Modal,
  Radio as V3Radio,
  RadioGroup as V3RadioGroup,
  RangeCalendar as V3RangeCalendar,
  Select as V3Select,
  Switch as V3Switch,
  Tabs as V3Tabs,
  TextArea as V3TextArea,
  Tooltip as V3Tooltip,
  Separator,
  useOverlayState,
  type UseOverlayStateReturn,
} from "@heroui/react";
import { Children, createContext, isValidElement, useContext, useMemo } from "react";

// ────────────────────────────────────────────────────────────────────────────
// addToast (v2 named export) → moved into utils/toast
export { addToast } from "@/utils/toast";

// ────────────────────────────────────────────────────────────────────────────
// Pure renames
export { CardContent as CardBody, CardHeader, CardFooter } from "@heroui/react";
export { Separator as Divider } from "@heroui/react";
// `Textarea` is a permissive shim defined further down (wraps V3TextArea).

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

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
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
  },
  ref,
) {
  return (
    <img
      alt={alt}
      className={[className, classNames?.img].filter(Boolean).join(" ")}
      loading={loading}
      ref={ref}
      src={src}
      {...rest}
    />
  );
});

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
  color?: string;
  radius?: string;
  isBordered?: boolean;
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
  variant?: string;
}

const V3_CARD_VARIANTS = new Set(["default", "transparent", "secondary", "tertiary"]);

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
  const v3Variant = (variant && V3_CARD_VARIANTS.has(variant)
    ? variant
    : undefined) as "default" | "transparent" | "secondary" | "tertiary" | undefined;
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
        variant={v3Variant}
        {...rest}
      >
        {children}
      </V3Card>
    );
  }
  return (
    <V3Card className={className} variant={v3Variant} {...rest}>
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
  isLoading?: boolean;
  spinner?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  disabled?: boolean;
  // Allow `as` to wrap render in another element/component (e.g. RouterLink).
  as?: React.ElementType;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  color: _c,
  radius: _r,
  isLoading,
  spinner,
  startContent,
  endContent,
  isDisabled,
  disabled,
  children,
  as,
  to,
  href,
  target,
  rel,
  ...props
}: ButtonShimProps) {
  const renderProp = as
    ? ((renderProps: Record<string, unknown>) => {
        const Component = as as React.ElementType;
        return (
          <Component
            {...(renderProps as object)}
            href={href}
            rel={rel}
            target={target}
            to={to}
          />
        );
      })
    : undefined;
  return (
    <V3Button
      isDisabled={isDisabled || disabled || isLoading}
      render={renderProp as React.ComponentProps<typeof V3Button>["render"]}
      {...(props as V3ButtonProps)}
    >
      {isLoading ? (
        spinner ?? (
          <span
            aria-hidden
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )
      ) : null}
      {!isLoading && startContent != null && (
        <span className="inline-flex items-center">{startContent}</span>
      )}
      {children as ReactNode}
      {!isLoading && endContent != null && (
        <span className="inline-flex items-center">{endContent}</span>
      )}
    </V3Button>
  );
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
// Chip shim — preserves v2 `startContent`, `endContent`, `onClose`, `classNames`.
export interface ChipShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: { base?: string; content?: string };
  color?: string;
  size?: "sm" | "md" | "lg";
  variant?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onClose?: () => void;
}

const V3_CHIP_COLORS = new Set(["default", "success", "warning", "danger", "accent"]);
const V3_CHIP_VARIANTS = new Set(["primary", "secondary", "tertiary", "soft"]);

export function Chip({
  children,
  className,
  classNames,
  color,
  size,
  variant,
  startContent,
  endContent,
  onClose,
}: ChipShimProps) {
  // Map v2 colors to v3: primary→accent, secondary→default (no v3 secondary).
  let v3Color: string | undefined = color;
  if (color === "primary") v3Color = "accent";
  else if (color === "secondary") v3Color = "default";
  else if (color && !V3_CHIP_COLORS.has(color)) v3Color = "default";
  const v3Variant = (variant && V3_CHIP_VARIANTS.has(variant) ? variant : undefined) as
    | "primary" | "secondary" | "tertiary" | "soft" | undefined;
  return (
    <V3Chip
      className={[className, classNames?.base].filter(Boolean).join(" ")}
      color={v3Color as "default" | "success" | "warning" | "danger" | "accent" | undefined}
      size={size}
      variant={v3Variant}
    >
      {startContent != null && (
        <span className="mr-1 inline-flex items-center">{startContent}</span>
      )}
      <span className={classNames?.content}>{children}</span>
      {endContent != null && (
        <span className="ml-1 inline-flex items-center">{endContent}</span>
      )}
      {onClose && (
        <button
          aria-label="close"
          className="ml-1 inline-flex cursor-pointer items-center opacity-60 hover:opacity-100"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      )}
    </V3Chip>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Input shim — wraps v3 Input with v2 label / description / errorMessage UX
// and maps `onValueChange(value)` to `onChange(event)`.
export interface InputShimProps {
  label?: ReactNode;
  labelPlacement?: "inside" | "outside" | "outside-left" | "outside-top";
  description?: ReactNode;
  errorMessage?: ReactNode;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  radius?: string;
  type?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  name?: string;
  id?: string;
  className?: string;
  classNames?: Record<string, string>;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isClearable?: boolean;
  isInvalid?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  fullWidth?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onClear?: () => void;
  color?: string;
  ref?: React.Ref<HTMLInputElement>;
  // tolerate validation / form-related v2 props
  validate?: (v: string) => true | string | null | undefined;
}

function withLabel({
  label,
  labelPlacement,
  description,
  errorMessage,
  classNames,
  control,
  startContent,
  endContent,
}: {
  label?: ReactNode;
  labelPlacement?: InputShimProps["labelPlacement"];
  description?: ReactNode;
  errorMessage?: ReactNode;
  classNames?: Record<string, string>;
  startContent?: ReactNode;
  endContent?: ReactNode;
  control: ReactElement;
}) {
  const hasExtras =
    label != null || description != null || errorMessage != null ||
    startContent != null || endContent != null;
  if (!hasExtras) return control;
  const isOutsideLeft = labelPlacement === "outside-left";
  return (
    <label
      className={[
        isOutsideLeft
          ? "flex flex-row items-center gap-2"
          : "flex flex-col gap-1",
        classNames?.base,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label != null && (
        <span
          className={["text-sm font-medium", classNames?.label]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        {startContent}
        {control}
        {endContent}
      </span>
      {description != null && (
        <span className="text-xs text-foreground/60">{description}</span>
      )}
      {errorMessage != null && (
        <span className="text-xs text-danger">{errorMessage}</span>
      )}
    </label>
  );
}

export const Input = React.forwardRef<HTMLInputElement, InputShimProps>(function Input(
  {
    label,
    labelPlacement,
    description,
    errorMessage,
    classNames,
    onValueChange,
    onChange,
    variant,
    size: _size,
    radius: _radius,
    isClearable: _isClearable,
    isInvalid: _isInvalid,
    validate: _validate,
    onClear: _onClear,
    color: _color,
    startContent,
    endContent,
    fullWidth,
    ...rest
  },
  ref,
) {
  const control = (
    <V3Input
      fullWidth={fullWidth}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange?.(e.target.value);
        onChange?.(e);
      }}
      ref={ref}
      variant={variant}
      {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
  return withLabel({
    label,
    labelPlacement,
    description,
    errorMessage,
    classNames,
    startContent,
    endContent,
    control,
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Textarea shim — same idea, for the v3 TextArea primitive.
export interface TextareaShimProps extends Omit<InputShimProps, "type"> {
  minRows?: number;
  maxRows?: number;
  rows?: number;
}

export function Textarea({
  label,
  labelPlacement,
  description,
  errorMessage,
  classNames,
  onValueChange,
  onChange,
  variant,
  size: _size,
  radius: _radius,
  minRows,
  maxRows: _maxRows,
  rows,
  isClearable: _ic,
  isInvalid: _ii,
  validate: _v,
  startContent,
  endContent,
  fullWidth,
  ...rest
}: TextareaShimProps) {
  const control = (
    <V3TextArea
      fullWidth={fullWidth}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onValueChange?.(e.target.value);
        (onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement> | undefined)?.(e);
      }}
      rows={rows ?? minRows}
      variant={variant}
      {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
    />
  );
  return withLabel({
    label,
    labelPlacement,
    description,
    errorMessage,
    classNames,
    startContent,
    endContent,
    control,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Checkbox shim — maps v2 `onValueChange(boolean)` and ignores legacy `classNames`.
export interface CheckboxShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: { base?: string; label?: string };
  isSelected?: boolean;
  defaultSelected?: boolean;
  onValueChange?: (v: boolean) => void;
  size?: string;
  color?: string;
  isDisabled?: boolean;
}

export function Checkbox({
  children,
  className,
  classNames,
  isSelected,
  defaultSelected,
  onValueChange,
  size: _size,
  color: _color,
  isDisabled,
}: CheckboxShimProps) {
  return (
    <V3Checkbox
      className={[className, classNames?.base].filter(Boolean).join(" ")}
      defaultSelected={defaultSelected}
      isDisabled={isDisabled}
      isSelected={isSelected}
      onChange={onValueChange}
    >
      <V3Checkbox.Control>
        <V3Checkbox.Indicator />
      </V3Checkbox.Control>
      {children != null && (
        <V3Checkbox.Content
          className={classNames?.label}
        >
          {children}
        </V3Checkbox.Content>
      )}
    </V3Checkbox>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tabs shim — preserves v2 `<Tabs><Tab key="x" title="X">panel</Tab></Tabs>`.
type TabChildProps = {
  title?: ReactNode;
  titleValue?: string;
  children?: ReactNode;
  className?: string;
};

export interface TabsShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: { base?: string; tabList?: string; tab?: string; panel?: string };
  selectedKey?: React.Key | null;
  defaultSelectedKey?: React.Key | null;
  onSelectionChange?: (key: React.Key) => void;
  variant?: string;
  color?: string;
  size?: string;
  fullWidth?: boolean;
  title?: ReactNode;
  "aria-label"?: string;
}

export function Tabs({
  children,
  className,
  classNames,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  variant: _variant,
  color: _color,
  size: _size,
  fullWidth: _fw,
}: TabsShimProps) {
  const items = Children.toArray(children).filter(isValidElement) as
    React.ReactElement<TabChildProps>[];
  return (
    <V3Tabs
      className={[className, classNames?.base].filter(Boolean).join(" ")}
      defaultSelectedKey={
        defaultSelectedKey == null ? undefined : String(defaultSelectedKey)
      }
      onSelectionChange={(k) => onSelectionChange?.(k)}
      selectedKey={selectedKey == null ? undefined : String(selectedKey)}
    >
      <V3Tabs.List className={classNames?.tabList}>
        {items.map((t) => (
          <V3Tabs.Tab
            className={classNames?.tab}
            id={String(t.key ?? t.props.titleValue ?? "")}
            key={t.key}
          >
            {t.props.title ?? t.props.titleValue ?? ""}
          </V3Tabs.Tab>
        ))}
      </V3Tabs.List>
      {items.map((t) => (
        <V3Tabs.Panel
          className={[t.props.className, classNames?.panel]
            .filter(Boolean)
            .join(" ")}
          id={String(t.key ?? t.props.titleValue ?? "")}
          key={t.key}
        >
          {t.props.children}
        </V3Tabs.Panel>
      ))}
    </V3Tabs>
  );
}

export function Tab(_props: TabChildProps): ReactElement | null {
  // Rendered as a child marker — Tabs picks props off the React element directly.
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// Dropdown family — keep v2 shape but mount popover automatically.
// v2: <Dropdown><DropdownTrigger><Button/></DropdownTrigger><DropdownMenu>...<DropdownItem .../></DropdownMenu></Dropdown>
// v3: <Dropdown><Dropdown.Trigger><Button/></Dropdown.Trigger><Dropdown.Popover><Dropdown.Menu>...<Dropdown.Item/></Dropdown.Menu></Dropdown.Popover></Dropdown>
export interface DropdownShimProps {
  children?: ReactNode;
  className?: string;
  size?: string;
  placement?: string;
}

export function Dropdown({
  children,
  size: _size,
  placement: _placement,
}: DropdownShimProps) {
  return <V3Dropdown>{children}</V3Dropdown>;
}

export const DropdownTrigger = V3Dropdown.Trigger;

export interface DropdownMenuShimProps {
  children?: ReactNode;
  className?: string;
  variant?: string;
  "aria-label"?: string;
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Iterable<React.Key>;
  defaultSelectedKeys?: Iterable<React.Key>;
  onSelectionChange?: (keys: unknown) => void;
  onAction?: (key: React.Key) => void;
}

export function DropdownMenu({
  children,
  className,
  variant: _variant,
  ...rest
}: DropdownMenuShimProps) {
  return (
    <V3Dropdown.Popover>
      <V3Dropdown.Menu
        className={className}
        {...(rest as Record<string, unknown>)}
      >
        {children as React.ReactNode}
      </V3Dropdown.Menu>
    </V3Dropdown.Popover>
  );
}

export interface DropdownItemShimProps {
  children?: ReactNode;
  className?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  color?: string;
  onPress?: () => void;
  onAction?: () => void;
  isDisabled?: boolean;
  id?: React.Key;
  textValue?: string;
}

export function DropdownItem({
  children,
  className,
  startContent,
  endContent,
  color: _color,
  onPress,
  onAction,
  isDisabled,
  id,
  textValue,
}: DropdownItemShimProps) {
  return (
    <V3Dropdown.Item
      className={className}
      id={id as string | number | undefined}
      isDisabled={isDisabled}
      onAction={onAction ?? onPress}
      textValue={
        textValue ?? (typeof children === "string" ? children : undefined)
      }
    >
      {startContent != null && (
        <span className="mr-2 inline-flex items-center">{startContent}</span>
      )}
      {children}
      {endContent != null && (
        <span className="ml-2 inline-flex items-center">{endContent}</span>
      )}
    </V3Dropdown.Item>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Select shim — keeps v2 `<Select><SelectItem key="...">label</SelectItem></Select>`.
// v3 Select expects items via children using <Select.Item id=…>.
export interface SelectShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: Record<string, string>;
  label?: ReactNode;
  labelPlacement?: InputShimProps["labelPlacement"];
  placeholder?: string;
  selectedKeys?: Iterable<React.Key>;
  defaultSelectedKeys?: Iterable<React.Key>;
  selectionMode?: "single" | "multiple";
  onSelectionChange?: (keys: unknown) => void;
  fullWidth?: boolean;
  isDisabled?: boolean;
  size?: string;
  variant?: "primary" | "secondary";
}

export function Select(props: SelectShimProps) {
  // v3 Select accepts most React-Aria selection props directly; pass-through.
  const {
    label,
    labelPlacement,
    classNames,
    selectionMode,
    ...rest
  } = props;
  const control = (
    <V3Select
      {...(rest as React.ComponentProps<typeof V3Select>)}
      selectionMode={selectionMode as "single" | "multiple" | undefined}
    />
  );
  return withLabel({
    label,
    labelPlacement,
    classNames,
    control,
  });
}

// SelectItem also reachable via Select.Item for v2 `<Select.Item>` access patterns.
export const SelectItem = ((props: { children?: ReactNode; id?: React.Key; textValue?: string }) => (
  // v3 Select consumes items via render-children; no top-level Item primitive exists.
  // Render a placeholder so the JSX type-checks; consumers passing items still see content.
  <>{props.children}</>
)) as React.FC<{ children?: ReactNode; id?: React.Key; textValue?: string }>;

(Select as unknown as { Item: typeof SelectItem }).Item = SelectItem;

// ────────────────────────────────────────────────────────────────────────────
// Calendar / DatePicker / RangeCalendar — permissive any-pass-through shims.
// These v3 components accept a complex generic over @internationalized/date types.
// We forward all props as-is; runtime correctness depends on consumers.
export const Calendar = ((props: Record<string, unknown>) => {
  // Strip v2-only props that v3 doesn't recognise.
  const rest = { ...props };
  delete rest.showShadow;
  delete rest.showMonthAndYearPickers;
  delete rest.visibleMonths;
  delete rest.color;
  delete rest.classNames;
  return <V3Calendar {...(rest as React.ComponentProps<typeof V3Calendar>)} />;
}) as React.FC<Record<string, unknown>>;

export const DatePicker = ((props: Record<string, unknown>) => {
  const rest = { ...props };
  delete rest.hideTimeZone;
  delete rest.showMonthAndYearPickers;
  delete rest.variant;
  delete rest.calendarProps;
  delete rest.radius;
  delete rest.classNames;
  delete rest.color;
  return <V3DatePicker {...(rest as React.ComponentProps<typeof V3DatePicker>)} />;
}) as React.FC<Record<string, unknown>>;

export const RangeCalendar = ((props: Record<string, unknown>) => {
  const rest = { ...props };
  delete rest.visibleMonths;
  delete rest.classNames;
  delete rest.color;
  return <V3RangeCalendar {...(rest as React.ComponentProps<typeof V3RangeCalendar>)} />;
}) as React.FC<Record<string, unknown>>;

export const DateRangePicker = RangeCalendar;

// ────────────────────────────────────────────────────────────────────────────
// Alert shim — v2 took `color`, `variant`, `title`, `description`. v3 is compound.
export interface AlertShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: { base?: string; title?: string; description?: string };
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: string;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  isVisible?: boolean;
}

const COLOR_TO_STATUS: Record<string, string> = {
  default: "default",
  primary: "accent",
  secondary: "default",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export function Alert({
  children,
  className,
  classNames,
  color,
  variant: _variant,
  title,
  description,
  icon,
  isVisible,
}: AlertShimProps) {
  if (isVisible === false) return null;
  const status = (color ? COLOR_TO_STATUS[color] : undefined) as
    | "default" | "success" | "warning" | "danger" | "accent" | undefined;
  return (
    <V3Alert
      className={[className, classNames?.base].filter(Boolean).join(" ")}
      status={status}
    >
      {icon != null && <V3Alert.Indicator>{icon}</V3Alert.Indicator>}
      <V3Alert.Content>
        {title != null && (
          <V3Alert.Title className={classNames?.title}>{title}</V3Alert.Title>
        )}
        {description != null && (
          <V3Alert.Description className={classNames?.description}>
            {description}
          </V3Alert.Description>
        )}
        {children}
      </V3Alert.Content>
    </V3Alert>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Link shim — v2 `isExternal`/`showAnchorIcon`/`size`/`color` props gone in v3.
export interface LinkShimProps {
  children?: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  isExternal?: boolean;
  showAnchorIcon?: boolean;
  anchorIcon?: ReactNode;
  size?: string;
  color?: string;
  underline?: string;
  onPress?: () => void;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function Link({
  children,
  className,
  href,
  target,
  rel,
  isExternal,
  showAnchorIcon,
  anchorIcon,
  size: _size,
  color: _color,
  underline: _underline,
  onPress,
  onClick,
}: LinkShimProps) {
  const effectiveTarget = target ?? (isExternal ? "_blank" : undefined);
  const effectiveRel =
    rel ?? (isExternal ? "noopener noreferrer" : undefined);
  return (
    <V3Link
      className={className}
      href={href}
      onClick={(e) => {
        onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
        onPress?.();
      }}
      rel={effectiveRel}
      target={effectiveTarget}
    >
      {children}
      {(showAnchorIcon || (isExternal && anchorIcon !== null)) && (
        <span aria-hidden className="ml-0.5 inline-block">
          {anchorIcon ?? "↗"}
        </span>
      )}
    </V3Link>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Accordion shim — accepts v2 `<Accordion><AccordionItem key title startContent>body</AccordionItem></Accordion>`.
// v3 needs <Accordion.Root> with <Accordion.Item><Accordion.Heading><Accordion.Trigger/></Accordion.Heading><Accordion.Panel/></Accordion.Item>.
export interface AccordionShimProps {
  children?: ReactNode;
  className?: string;
  selectionMode?: string;
  selectedKeys?: Iterable<React.Key>;
  defaultSelectedKeys?: Iterable<React.Key>;
  onSelectionChange?: (keys: unknown) => void;
  showDivider?: boolean;
  hideIndicator?: boolean;
  variant?: string;
  itemClasses?: Record<string, unknown>;
  style?: React.CSSProperties;
  as?: string;
}

export function Accordion({
  children,
  className,
  showDivider,
  hideIndicator: _hideIndicator,
  variant: _variant,
  itemClasses: _ic,
  selectionMode: _sm,
  selectedKeys: _sk,
  defaultSelectedKeys: _dsk,
  onSelectionChange,
  style,
  as: _as,
}: AccordionShimProps) {
  return (
    <V3Accordion
      className={className}
      hideSeparator={showDivider === false}
      onExpandedChange={onSelectionChange as (keys: Set<React.Key>) => void}
      style={style}
    >
      {children as React.ReactNode}
    </V3Accordion>
  );
}

export interface AccordionItemShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: Record<string, string>;
  title?: ReactNode;
  subtitle?: ReactNode;
  startContent?: ReactNode;
  indicator?: ReactNode;
  "aria-label"?: string;
  onPress?: () => void;
  hidden?: boolean;
  id?: React.Key;
}

export function AccordionItem({
  children,
  className,
  title,
  subtitle,
  startContent,
  hidden,
  id,
  classNames,
  onPress,
  "aria-label": ariaLabel,
}: AccordionItemShimProps) {
  if (hidden) return null;
  return (
    <V3Accordion.Item
      className={[className, classNames?.base].filter(Boolean).join(" ")}
      id={id as string | number | undefined}
    >
      <V3Accordion.Heading>
        <V3Accordion.Trigger
          aria-label={ariaLabel}
          className={classNames?.trigger}
          onPress={onPress}
        >
          {startContent != null && (
            <span className="mr-2 inline-flex items-center">{startContent}</span>
          )}
          <span className="flex flex-col items-start">
            <span>{title}</span>
            {subtitle != null && (
              <span className="text-xs text-foreground/60">{subtitle}</span>
            )}
          </span>
        </V3Accordion.Trigger>
      </V3Accordion.Heading>
      <V3Accordion.Panel className={classNames?.content}>
        {children}
      </V3Accordion.Panel>
    </V3Accordion.Item>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Switch shim — adapts v2 `isSelected`/`onValueChange` to v3 compound Switch.
export interface SwitchShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: Record<string, string>;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onValueChange?: (v: boolean) => void;
  size?: string;
  color?: string;
  isDisabled?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
}

export function Switch({
  children,
  className,
  classNames,
  isSelected,
  defaultSelected,
  onValueChange,
  size,
  color: _color,
  isDisabled,
}: SwitchShimProps) {
  return (
    <V3Switch
      className={[className, classNames?.base].filter(Boolean).join(" ")}
      defaultSelected={defaultSelected}
      isDisabled={isDisabled}
      isSelected={isSelected}
      onChange={onValueChange}
      size={size as "sm" | "md" | "lg" | undefined}
    >
      <V3Switch.Control>
        <V3Switch.Thumb />
      </V3Switch.Control>
      {children != null && (
        <V3Switch.Content className={classNames?.label}>
          {children}
        </V3Switch.Content>
      )}
    </V3Switch>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Radio / RadioGroup shims — v2 RadioGroup took `value/onValueChange/description/orientation`.
// v3 RadioGroup uses React Aria semantics (`value/onChange`). Radio v3 is compound.
export interface RadioGroupShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: Record<string, unknown>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onChange?: (v: string) => void;
  orientation?: "horizontal" | "vertical";
  description?: ReactNode;
  label?: ReactNode;
  name?: string;
  isDisabled?: boolean;
}

export function RadioGroup({
  children,
  className,
  value,
  defaultValue,
  onValueChange,
  onChange,
  orientation,
  description,
  label,
  name,
  isDisabled,
}: RadioGroupShimProps) {
  return (
    <V3RadioGroup
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      name={name}
      onChange={onValueChange ?? onChange}
      orientation={orientation}
      value={value}
    >
      {label != null && (
        <span className="text-sm font-medium">{label}</span>
      )}
      {children as React.ReactNode}
      {description != null && (
        <span className="text-xs text-foreground/60">{description}</span>
      )}
    </V3RadioGroup>
  );
}

export interface RadioShimProps {
  children?: ReactNode;
  className?: string;
  classNames?: Record<string, unknown>;
  value?: string;
  description?: ReactNode;
  isDisabled?: boolean;
}

export function Radio({
  children,
  className,
  classNames,
  value,
  description,
  isDisabled,
}: RadioShimProps) {
  return (
    <V3Radio
      className={[className, classNames?.base as string | undefined]
        .filter(Boolean)
        .join(" ")}
      isDisabled={isDisabled}
      value={value as string}
    >
      <V3Radio.Control>
        <V3Radio.Indicator />
      </V3Radio.Control>
      <V3Radio.Content className={classNames?.label as string | undefined}>
        {children}
        {description != null && (
          <span
            className={[
              "text-xs text-foreground/60",
              classNames?.description as string | undefined,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {description}
          </span>
        )}
      </V3Radio.Content>
    </V3Radio>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Re-export Separator under both names so files using `Separator` keep working too
export { Separator };

// Reference UseOverlayStateReturn so the import isn't pruned (used by tooling later)
export type { UseOverlayStateReturn };
