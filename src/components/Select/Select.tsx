import React from 'react';

import { cn } from '@/libs/cn';
import { Icon } from '@/libs/icon';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

const disabledSelectStyles =
  'disabled:cursor-not-allowed disabled:border-neutral-grey-100 disabled:bg-[#F3F3F4] disabled:text-neutral-grey-600 disabled:opacity-100';

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, disabled, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        {label ? (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-neutral-grey-600"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'h-[42px] w-full appearance-none rounded-[10px] border border-neutral-grey-100 bg-white py-0 pl-3 pr-10 text-sm text-neutral-grey-600 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline-none focus:border-brand-primary',
              disabledSelectStyles,
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center',
              disabled ? 'text-neutral-grey-400' : 'text-neutral-grey-500',
            )}
            aria-hidden
          >
            <Icon icon="hugeicons:arrow-down-01" className="h-4 w-4 shrink-0" />
          </span>
        </div>
        {error ? <p className="text-xs text-semantics-red">{error}</p> : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
