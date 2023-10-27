import clsx from "clsx";
import { TailwindSize } from "@/lib/tailwind";
import { Spin } from "../Spin";

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
