import clsx from "clsx";
import { Spin } from "../Spin";
import { TailwindSize } from "@/lib/tailwind";

type LoadingSectionProps = {
  className?: string;
  size?: TailwindSize;
};

export function LoadingSection({ className, size }: LoadingSectionProps) {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <Spin size={size} />
    </div>
  );
}
