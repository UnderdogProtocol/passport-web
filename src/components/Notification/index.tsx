import { Fragment, ReactNode } from "react";
import toast, { Toast, ToastOptions } from "react-hot-toast";
import { HiX } from "react-icons/hi";

import { Transition } from "../Transition";
import { Header, HeaderProps } from "../MediaObject/Header";
import clsx from "clsx";
import { Button } from "../Button";

export type NotificationProps = HeaderProps & {
  t: Toast;
  closable?: boolean;
  children?: ReactNode;
};

export const renderNotification = (
  notificationProps: Omit<NotificationProps, "t">,
  options?: ToastOptions
) => {
  toast.custom((t) => <Notification t={t} {...notificationProps} />, options);
};

export function BaseNotification(notificationProps: NotificationProps) {
  const { t, children } = notificationProps;
  const notificationClassName = clsx(
    "max-w-md w-full bg-dark-light rounded-lg pointer-events-auto flex",
    "items-center z-60 border border-dark-accent space-x-2"
  );

  return (
    <Transition type="scaleUp" show={t.visible || false} appear as={Fragment}>
      <div className={notificationClassName}>
        {children}
        <Button type="link" onClick={() => toast.dismiss(t.id)}>
          <HiX className="h-5 w-5" />
        </Button>
      </div>
    </Transition>
  );
}

export function Notification(notificationProps: NotificationProps) {
  const { title, description } = notificationProps;

  return (
    <BaseNotification {...notificationProps}>
      <div className="flex-1 p-4">
        <Header title={title} description={description} size="2xl" />
      </div>
    </BaseNotification>
  );
}
