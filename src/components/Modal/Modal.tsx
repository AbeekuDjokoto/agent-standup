import React from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/libs/cn';
import { Icon } from '@/libs/icon';

import { Text } from '../Text';

type Props = Readonly<{
  children: React.ReactNode;
  showClose?: boolean;
  isOpen: boolean;
  setIsOpen?: (o: boolean) => void;
  position?: 'center' | 'side';
  title?: string;
  panelWrapperClass?: string;
  titleBarClass?: string;
  titleClass?: string;
  panelClass?: string;
  overflowHidden?: boolean;
}>;

export function Modal(props: Props) {
  const {
    children,
    isOpen = false,
    setIsOpen,
    showClose,
    position = 'center',
  } = props;

  return (
    <AnimatePresence>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            asChild
            className="modal-overlay data-[state=open]:animate-overlayShow fixed inset-0 z-[200] bg-black/[70%] backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0 }}
            />
          </Dialog.Overlay>

          {/* CENTER */}
          {position === 'center' ? (
            <Dialog.Content asChild>
              <motion.div className="modal-content !pointer-events-none fixed inset-0 z-[200] grid min-h-full items-center justify-center overflow-y-auto py-10 focus:outline-none">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 16 }}
                  exit={{
                    scale: 0.8,
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  className={cn(
                    props.panelClass,
                    { '!overflow-hidden': props.overflowHidden },
                    '!pointer-events-auto relative mx-auto my-20 w-[430px] min-w-[200px] max-w-[90vw] rounded-lg bg-white shadow-xl',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {children}
                  {showClose ? (
                    <Dialog.Close asChild>
                      <button
                        data-testid="modal-close-btn"
                        className="absolute -top-[28px] right-0"
                      >
                        <Icon
                          icon={'hugeicons:cancel-01'}
                          className="text-2xl text-white"
                        />
                      </button>
                    </Dialog.Close>
                  ) : null}
                </motion.div>
              </motion.div>
            </Dialog.Content>
          ) : null}

          {/* SIDE */}
          {position === 'side' ? (
            <Dialog.Content asChild>
              <motion.div
                className="modal-content !pointer-events-none fixed inset-0 z-[200] grid min-h-full items-center justify-center overflow-y-auto py-10 focus:outline-none"
                initial={{ x: 600 }}
                animate={{ x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 19,
                }}
                exit={{
                  x: 200,
                  opacity: 0,
                }}
              >
                <div
                  className={cn(
                    props.panelClass,
                    '!pointer-events-auto absolute right-[16px] mx-auto grid h-[calc(100dvh_-_32px)] w-[497px] min-w-[200px] max-w-[90vw] grid-rows-1 overflow-hidden rounded-lg bg-white text-left shadow-xl',
                    { '!grid-rows-[max-content_1fr]': !!props.title },
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {/* TITLE BAR */}
                  {props.title ? (
                    <div
                      className={cn(
                        'border-b-base-100 border-b p-6 py-[18px] pr-12',
                        props.titleBarClass,
                      )}
                    >
                      <Text
                        weight="bold"
                        className="text-base-900 !text-lg font-bold leading-[28px]"
                      >
                        {props.title}
                      </Text>
                    </div>
                  ) : null}

                  <div className={cn('overflow-y-auto')}>{children}</div>
                </div>
              </motion.div>
            </Dialog.Content>
          ) : null}
        </Dialog.Portal>
      </Dialog.Root>
    </AnimatePresence>
  );
}
