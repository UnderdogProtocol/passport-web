import { Popover } from "@headlessui/react";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { MediaObject } from "@/components/MediaObject";
import { SessionPopoverPanel } from "./SessionPopoverPanel";

export const SessionPopover = () => {
  const session = useSession();

  const user = useMemo(() => session?.data?.user, [session]);

  if (!user) return null;

  return (
    <Popover as="div" className="relative flex-shrink-0">
      <Popover.Button className="bg-dark-light p-2 rounded-md focus:outline-none">
        <MediaObject
          media={{ src: user.image || undefined }}
          title={user.email}
        />
      </Popover.Button>

      <SessionPopoverPanel className="absolute right-0 mt-2 w-64" />
    </Popover>
  );
};
