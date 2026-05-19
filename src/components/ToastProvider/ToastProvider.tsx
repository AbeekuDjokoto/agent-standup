import React from 'react';
import { createPortal } from 'react-dom';

import { AnimatePresence, motion } from 'framer-motion';
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
    }[]
  >([]);

  function removeNotification(id: string) {
    setNotificationList((list) => list.filter((item) => item.id !== id));
  }

  const addMessage = React.useCallback(
    (message: string, type: ToastNotificationType, title?: string) => {
      const id = nanoid();
      setNotificationList((list) => [
        ...list,
        { message, type, id, title },
      ]);

      setTimeout(() => removeNotification(id), 4000);
    },
    [],
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
        <ul
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[1000] flex w-auto max-w-none flex-col gap-2 sm:left-auto sm:right-5 sm:w-[min(340px,calc(100vw-2.5rem))]"
        >
          <AnimatePresence>
            {notificationList
              .filter((item) => !item.ended)
              .map(({ id, message, title, type }, index) => {
                const VariantIcon = variantIcons[type];
                return (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.2,
                    }}
                    className={cn(
                      'pointer-events-auto flex w-full items-start gap-2.5 rounded-[10px] p-3 shadow',
                      'h-auto max-h-none',
                      variantStyles[type],
                    )}
                  >
                    <VariantIcon
                      width={20}
                      height={20}
                      variant="Bold"
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      {title ? (
                        <p className="text-sm font-semibold leading-snug">
                          {title}
                        </p>
                      ) : null}
                      <p
                        className={cn(
                          'text-sm leading-snug',
                          title ? 'mt-0.5' : undefined,
                        )}
                      >
                        {message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNotification(id)}
                      data-testid="close-toast"
                      className="-mr-0.5 shrink-0 rounded p-0.5 opacity-90 hover:opacity-100"
                      aria-label="Dismiss notification"
                    >
                      <Icon icon="si:close-line" width={18} height={18} />
                    </button>
                  </motion.li>
                );
              })}
          </AnimatePresence>
        </ul>,
        document.body,
      )}
    </>
  );
}
