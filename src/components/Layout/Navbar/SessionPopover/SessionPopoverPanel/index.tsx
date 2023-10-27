import { MediaObject } from "@/components/MediaObject";
import { Popover } from "@headlessui/react";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

export type SessionPopoverPanelProps = {
  className?: string;
};

export const SessionPopoverPanel: React.FC<SessionPopoverPanelProps> = ({
  className,
}) => {
  const sessionPopoverPanelClassName = clsx(
    "bg-dark-light rounded-md focus:outline-none border border-dark-accent z-40 p-2",
    className,
  );

  return (
    <Popover.Panel className={sessionPopoverPanelClassName}>
      <MediaObject
        title="Sign Out"
        onClick={() => signOut()}
        media={{
          icon: <HiArrowLeftOnRectangle className="text-light h-5 w-5" />,
        }}
      />
    </Popover.Panel>
  );
};
