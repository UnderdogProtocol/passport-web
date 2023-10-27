import clsx from "clsx";
import { ReactNode } from "react";

export type DescriptionListProps = {
  items: {
    title: ReactNode;
    description: ReactNode;
  }[];
  className?: string;
};

export function DescriptionList({
  items,
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl className={clsx("space-y-4", className)} {...props}>
      {items.map(({ title, description }, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-2"
        >
          <dt className="truncate text-sm sm:text-base text-light">{title}</dt>
          <dd className="text-light">{description}</dd>
        </div>
      ))}
    </dl>
  );
}
