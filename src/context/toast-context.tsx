import React from 'react';

export type ToastNotificationType = 'info' | 'success' | 'error';

type ToastContextValue = {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
};
export const ToastContext = React.createContext<ToastContextValue>(
  {} as ToastContextValue,
);

export function ToastContextProvider({
  children,
  addMessage,
}: React.PropsWithChildren<{
  addMessage: (
    message: string,
    type: ToastNotificationType,
    title?: string,
  ) => void;
}>) {
  const success = React.useCallback(
    (message: string, title?: string) => addMessage(message, 'success', title),
    [addMessage],
  );

  const error = React.useCallback(
    (message: string, title?: string) => addMessage(message, 'error', title),
    [addMessage],
  );

  const info = React.useCallback(
    (message: string, title?: string) => addMessage(message, 'info', title),
    [addMessage],
  );

  const value = React.useMemo(() => {
    return { success, error, info };
  }, [success, error, info]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
