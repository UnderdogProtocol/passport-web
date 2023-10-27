import {
  TailwindSize,
  sizeToFontSizeClassName,
  sizeToPaddingClassName,
} from "@/lib/tailwind";
import clsx from "clsx";
import { ReactNode } from "react";

const styles = {
  default: "text-dark-800 bg-dark-100",
  primary: "text-primary-800 bg-primary-300",
  secondary: "text-lightPurple-900 bg-lightPurple-300",
  danger: "text-rubin-800 bg-rubin-100",
};

export type BadgeType = keyof typeof styles;

export type BadgeProps = {
  children: ReactNode;
  className?: string;
  size?: TailwindSize;
  type?: BadgeType;
};

export function Badge({
  className,
  children,
  size = "md",
  type = "default",
}: BadgeProps) {
  const badgeClassName = clsx(
    sizeToPaddingClassName[size],
    sizeToFontSizeClassName[size],
    styles[type],
    "inline-flex items-center rounded-t rounded-br",
    className,
  );

  return <div className={badgeClassName}>{children}</div>;
}
