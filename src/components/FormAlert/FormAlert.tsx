import type { ReactNode } from 'react';

import { cn } from '@/libs/cn';

type FormAlertProps = {
  variant?: 'error' | 'info';
  children: ReactNode;
  className?: string;
};

const variantClassName = {
  error: 'border-semantics-red/25 bg-red-50 text-semantics-red',
  info: 'border-neutral-grey-200 bg-neutral-grey-50 text-neutral-grey-600',
} as const;

export function FormAlert({
  variant = 'error',
  children,
  className,
}: FormAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-3 py-2.5 text-sm leading-snug',
        variantClassName[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
