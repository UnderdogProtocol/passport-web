import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Overlay() {
  return (
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
    </Transition.Child>
  );
}
