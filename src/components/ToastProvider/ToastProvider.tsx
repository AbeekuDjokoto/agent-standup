import React from 'react';
import { createPortal } from 'react-dom';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import {
  CloseCircle,
  Danger,
  Icon as IconsaxIcon,
  TickCircle,
} from 'iconsax-react';
import { nanoid } from 'nanoid';

import {
  ToastContextProvider,
  ToastNotificationType,
} from '../../context/toast-context';
import { cn } from '@/libs/cn';
import { Icon } from '@/libs/icon';

export function ToastProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [notificationList, setNotificationList] = React.useState<
    {
      message: string;
      title?: string;
      type: ToastNotificationType;
      id: string;
      ended?: boolean;
      nodeRef?: React.RefObject<HTMLDivElement>;
    }[]
  >([
    // {
    //   message: 'This is a success toast',
    //   title: 'Success',
    //   type: 'success',
    //   id: nanoid(),
    // },
    // { message: 'This is an error toast', type: 'error', id: nanoid() },
    // { message: 'This is an info toast', type: 'info', id: nanoid() },
  ]);

  function removeNotification(id: string) {
    setNotificationList((list) => list.filter((item) => item.id !== id));
  }

  const addMessage = React.useCallback(
    (message: string, type: ToastNotificationType, title?: string) => {
      const id = nanoid();
      setNotificationList((list) => [
        ...list,
        { message, type, id, title, nodeRef: React.createRef() },
      ]);

      setTimeout(() => removeNotification(id), 4000);
    },
    [setNotificationList],
  );

  const variantStyles: Record<ToastNotificationType, string> = {
    success: 'bg-semantics-green text-white',
    error: 'bg-semantics-red text-white',
    info: 'bg-neutral-grey-500 text-white',
  };

  const variantIcons: Record<ToastNotificationType, IconsaxIcon> = {
    success: TickCircle,
    error: CloseCircle,
    info: Danger,
  };
  return (
    <>
      <ToastContextProvider addMessage={addMessage}>
        {children}
      </ToastContextProvider>
      {createPortal(
        <ul className="fixed z-[1000] grid gap-3 right-5 top-5 w-[340px]">
          <LayoutGroup>
            <AnimatePresence>
              {notificationList
                .filter((item) => !item.ended)
                .map(({ id, message, title, type }, index) => {
                  const VariantIcon = variantIcons[type];
                  return (
                    <motion.li
                      layout
                      initial={{ x: '150%' }}
                      animate={{ x: 0 }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        delay: index * 0.05,
                        stiffness: 150,
                        damping: 14,
                        type: 'spring',
                      }}
                      className={cn(
                        'grid grid-cols-[max-content_1fr_max-content_max-content] items-start gap-2',
                        'shadow p-4 py-[13px] rounded-[10px]',
                        variantStyles[type],
                      )}
                      key={id}
                    >
                      <VariantIcon
                        width={24}
                        height={24}
                        variant="Bold"
                        className="mt-[1px]"
                      />
                      <div className="flex flex-col gap-1">
                        {title ? (
                          <span className="text-base font-semibold leading-[1.375]">
                            {title}
                          </span>
                        ) : null}
                        <span className="inline-block my-0.5 text-sm">
                          {message}
                        </span>
                      </div>
                      <div className="relative border-l border-neutral-grey-100/20 h-full -right-1"></div>
                      <button
                        onClick={() => removeNotification(id)}
                        data-testid="close-toast"
                        type="button"
                      >
                        <Icon icon="si:close-line" width="24" />
                      </button>
                    </motion.li>
                  );
                })}
            </AnimatePresence>
          </LayoutGroup>
        </ul>,
        document.body,
      )}
    </>
  );
}
