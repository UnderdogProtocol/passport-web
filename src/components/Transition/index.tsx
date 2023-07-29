import { Transition as HeadlessTransition, TransitionClasses } from "@headlessui/react";
import { ReactNode } from "react";

type TransitionType = "slideDown" | "scaleUp" | "fadeIn";

interface TransitionProps {
  type: TransitionType;
  children: ReactNode;
  as?: any;
  show?: boolean;
  appear?: boolean;
}

const transitionProps: Record<TransitionType, TransitionClasses> = {
  slideDown: {
    enter: "transition duration-400 origin-top",
    enterFrom: "transform scale-y-0",
    enterTo: "transform scale-y-100",
    leave: "transition duration-400 origin-top",
    leaveFrom: "transform scale-y-100",
    leaveTo: "transform scale-y-0",
  },
  scaleUp: {
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-90",
    enterTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-100",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-90",
  },
  fadeIn: {
    leave: "transition ease-in duration-100",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
  },
};

export function Transition({ type, children, as, show, appear }: TransitionProps) {
  return (
    <HeadlessTransition {...transitionProps[type]} as={as} show={show} appear={appear}>
      {children}
    </HeadlessTransition>
  );
}
