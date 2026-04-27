import React from 'react';
import { Link } from 'react-router-dom';

import { Icon, IconifyIcon, IconProps } from '@iconify/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/libs/cn';

const buttonClasses = cva(
  'flex flex-shrink-0 items-center justify-center rounded-xl gap-2 text-sm font-medium transition whitespace-nowrap outline-none ring-offset-2 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary text-white hover:bg-[#e98000] focus:bg-[#e98000] disabled:bg-[#f9b66c]',
        secondary:
          'bg-brand-secondary-blue text-white hover:bg-[#0b2560] focus:bg-[#0b2560] disabled:bg-[#7a91bf]',
        outline:
          'border border-neutral-grey-100 bg-white text-neutral-grey-500 hover:bg-[#f8f8f8] hover:border-neutral-grey-200 disabled:text-[#D1D5DB] disabled:border-neutral-grey-100 disabled:bg-transparent',
        auth:
          'rounded-full border border-white/15 bg-brand-primary text-white shadow-[0px_1px_2px_0px_rgba(14,18,27,0.24),0px_0px_0px_1px_#fc8e00] hover:bg-[#e98000] focus:bg-[#e98000]',
        google:
          'rounded-full border border-neutral-grey-200 bg-white text-neutral-grey-600 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] hover:bg-neutral-grey-100',
        danger:
          'bg-semantics-red text-white hover:bg-semantics-red-700 focus:bg-semantics-red-700 disabled:bg-semantics-red-200',
        success:
          'bg-brand-secondary-green-2000 text-white hover:bg-brand-secondary-green-3000 focus:bg-brand-secondary-green-3000 disabled:bg-brand-secondary-green-2000',
      },
      size: {
        small: 'h-9 px-3 text-sm',
        medium: 'h-10 px-4 text-sm',
        default: 'h-12 px-6 ',
        auth: 'h-[46px] px-[10px] text-sm',
      },
      disabled: {
        true: 'active:!scale-[1] cursor-not-allowed',
      },
      iconOnly: {
        true: '!px-0 !min-w-[0]',
      },
      minW: {
        true: 'min-w-[48px]',
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: 'small',
        className: 'w-9',
      },
      {
        iconOnly: true,
        size: 'medium',
        className: 'w-10',
      },
      {
        iconOnly: true,
        size: 'default',
        className: 'w-12',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      iconOnly: false,
      disabled: false,
    },
  },
);

type ButtonClasses = VariantProps<typeof buttonClasses>;

type AsProp = React.ElementType | React.ComponentType<any>;

type ButtonProps<T extends AsProp = 'button'> = {
  as?: T;
  icon?: IconifyIcon | string;
  iconPosition?: 'left' | 'right';
  iconProps?: Partial<IconProps>;
  loading?: boolean;
  className?: string;
  suffix?: React.ReactNode;
} & React.ComponentProps<'button' | typeof Link> &
  Omit<ButtonClasses, 'minW'>;

export function Button<T extends AsProp = 'button'>(props: ButtonProps<T>) {
  const {
    as = 'button',
    iconProps = {},
    iconPosition,
    disabled,
    iconOnly,
    icon,
    loading = false,
    children,
    variant,
    className,
    size,
    suffix,
    ...rest
  } = props;

  const evaluatedProps = {
    className: cn(
      buttonClasses({
        variant,
        size,
        disabled: disabled || loading,
        iconOnly,
        minW: !className?.includes('h-'),
      }),
      className,
    ),
    disabled: disabled || loading,
    ...rest,
  };

  const renderedIcon = icon ? <Icon {...iconProps} icon={icon} /> : null;

  return React.createElement(
    as,
    evaluatedProps as React.ComponentProps<typeof Link>,
    iconPosition === 'left' && !loading && icon ? renderedIcon : null,
    iconOnly && icon && !loading ? renderedIcon : null,
    loading ? (
      <Icon icon="hugeicons:loading-03" className="animate-spin text-xl" />
    ) : null,
    !loading ? children : null,
    iconPosition === 'right' && !loading && icon ? renderedIcon : null,
    suffix,
  );
}
