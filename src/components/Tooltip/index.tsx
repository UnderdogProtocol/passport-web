import clsx from "clsx";
import React, { ReactNode } from "react";

export type TooltipPosition = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: TooltipPosition;
  color?: string;
}

const positionClassName = {
  top: "bottom-full left-1/2 -translate-x-1/2 justify-center",
  right: "left-full top-1/2 -translate-y-1/2 justify-start",
  left: "right-full top-1/2 -translate-y-1/2 justify-end",
  bottom: "top-full left-1/2 -translate-x-1/2 justify-center",
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = "top",
}) => {
  if (!text) return <>{children}</>;

  return (
    <div className="group relative flex items-center">
      {children}
      <div
        className={clsx(
          "absolute z-50 hidden w-64 transform group-hover:flex",
          positionClassName[position],
        )}
      >
        <div className="bg-dark-light border-dark-accent m-0.5 max-w-full rounded border px-2 py-1 text-sm">
          {text}
        </div>
      </div>
    </div>
  );
};
