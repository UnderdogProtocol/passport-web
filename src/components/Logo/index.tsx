import { TailwindSize, sizeToDimensionsClassName } from "@/lib/tailwind";
import clsx from "clsx";

type LogoProps = {
  size?: TailwindSize;
  className?: string;
  dark?: boolean;
  full?: boolean;
};

const UNDERDOG_PROTOCOL_LOGOS_URL =
  "https://storage.googleapis.com/underdog-protocol/logos";

export function Logo({ className, size = "md", dark, full }: LogoProps) {
  const logoClassName = clsx(
    full ? "" : sizeToDimensionsClassName[size],
    className
  );

  return (
    <div className={logoClassName}>
      <img
        src={`${UNDERDOG_PROTOCOL_LOGOS_URL}/${full ? "full" : "icon"}_${
          dark ? "dark" : "light"
        }.svg`}
        alt="logo"
      />
    </div>
  );
}
