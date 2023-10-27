import { Menu } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";

import { Transition } from "../Transition";
import { Button, ButtonProps } from "../Button";

export type DropdownProps = {
  items: ButtonProps[];
  children?: ReactNode;
  className?: string;
};

export function Dropdown({ items = [], children, className }: DropdownProps) {
  if (items.length === 0) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Button} type="link">
        {children || <HiEllipsisHorizontal className="text-lg text-primary" />}
      </Menu.Button>

      <Transition type="scaleUp" as={Fragment}>
        <Menu.Items className="bg-dark border-dark-accent absolute right-0 z-40 w-56 origin-top-right divide-y divide-gray-100 rounded-md border focus:outline-none">
          <div className="px-1 py-1 ">
            {items.map((buttonProps, i) => (
              <Menu.Item key={i}>
                <Button
                  type="link"
                  block
                  className="justify-start"
                  {...buttonProps}
                />
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
