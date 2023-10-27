import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

import clsx from "clsx";
import { TailwindSize, sizeToMaxWClassName } from "@/lib/tailwind";
import Overlay from "./Overlay";

export interface ModalProps {
  open: boolean;
  children?: ReactNode;
  onClose?: () => void;
  title?: string;
  closable?: boolean;
  className?: string;
  size?: TailwindSize;
}

export function Modal({
  open,
  onClose,
  size = "md",
  children,
  closable = true,
  className,
}: ModalProps) {
  const handleClose = () => {
    if (closable && onClose) {
      onClose();
    }
  };

  const dialogClassName = clsx(
    "fixed z-20 inset-0 overflow-y-auto flex items-center justify-center min-h-screen",
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        static
        as="div"
        className={dialogClassName}
        open={open}
        onClose={handleClose}
      >
        <Overlay />

        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          className={clsx("w-full px-4", sizeToMaxWClassName[size])}
        >
          {children}
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
