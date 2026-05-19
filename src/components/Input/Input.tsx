import React from 'react';

import { cn } from '../../libs/cn';
import { Icon } from '../../libs/icon';
import { InputLabel } from '../InputLabel/InputLabel';
import { ErrorText } from '../Text';

type Props = Readonly<{
  [other: string]: any;

  error?: string | boolean;
  className?: string;
  label?: string;
  labelChild?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'] | 'textarea';
  name?: string;
  id?: string;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  iconBefore?: React.ReactNode;

  innerClassName?: string;
  inputClassName?: string;
}> &
  React.HTMLAttributes<HTMLInputElement> &
  React.HTMLAttributes<HTMLTextAreaElement>;

export const Input = React.forwardRef(
  (props: Props, ref: React.Ref<HTMLInputElement & HTMLTextAreaElement>) => {
    const {
      label,
      labelChild,
      type = 'text',
      error = '',
      className,
      inputClassName,
      innerClassName,
      prefix,
      suffix,
      id,
      ...otherProps
    } = props;

    delete otherProps.defaultValue;

    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const isTextarea = type === 'textarea';
    const isPassword = type === 'password';

    const [show, setShow] = React.useState(false);

    const computedTestId = `input-${label}`;

    const computedType = React.useMemo(() => {
      switch (type) {
        case 'password':
          return show ? 'text' : 'password';
        case 'date':
          return 'date';
        default:
          return type;
      }
    }, [type, show]);

    const { onFocus: onFocusProp, ...inputProps } = otherProps;

    const computedInputClassName = cn(
      // 16px prevents iOS Safari auto-zoom on focus, which can lock scrolling with overflow-x hidden.
      'w-full min-w-0 self-stretch border-none bg-transparent text-base text-neutral-grey-600 outline-none',
      'placeholder:text-neutral-grey-300 disabled:cursor-not-allowed',
      inputClassName,
    );

    function focusOnInput() {
      const field = wrapperRef.current?.querySelector('input, textarea') as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (!field || field === document.activeElement) return;
      field.focus();
    }

    function handleInnerClick(e: React.MouseEvent<HTMLDivElement>) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button')
      ) {
        return;
      }
      focusOnInput();
    }

    function handleFieldFocus(
      e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>,
    ) {
      onFocusProp?.(e);
      if (window.innerWidth < 768) {
        window.setTimeout(() => {
          e.currentTarget.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });
        }, 300);
      }
    }

    function handleToggleShow() {
      setShow((prev) => !prev);
      focusOnInput();
    }

    return (
      /* WRAPPER */
      <div ref={wrapperRef} className={cn('wrapper min-w-0', className)}>
        {/* LABEL */}
        {label ? (
          <InputLabel
            htmlFor={props?.id ?? props.name}
            className="flex items-center gap-1"
          >
            {label} {labelChild}
          </InputLabel>
        ) : null}

        {/* INNER */}
        <div
          onClick={handleInnerClick}
          className={cn(
            'flex items-center gap-2 rounded-[10px] border border-neutral-grey-100 bg-white px-3 py-[10px]',
            'shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] focus-within:border-brand-primary',
            { 'border-semantics-red': !!error },
            { 'h-[42px]': !isTextarea },
            { 'bg-[#F3F3F4]': inputProps.disabled },
            innerClassName,
          )}
        >
          {prefix}

          {props.iconBefore && (
            <InputPrefixIconWrapper>{props.iconBefore}</InputPrefixIconWrapper>
          )}

          {/* TEXT FIELD */}
          {!isTextarea ? (
            <input
              data-testid={computedTestId}
              type={computedType}
              ref={ref}
              className={computedInputClassName}
              id={id ?? inputProps.name}
              onFocus={handleFieldFocus}
              {...inputProps}
            />
          ) : null}

          {/* TEXTAREA */}
          {isTextarea ? (
            <textarea
              data-testid={computedTestId}
              className={computedInputClassName}
              ref={ref}
              id={id ?? inputProps.name}
              onFocus={handleFieldFocus}
              {...inputProps}
            ></textarea>
          ) : null}

          {suffix}
          {isPassword ? (
            <button
              type="button"
              className="grid place-content-center w-6 h-6 text-base text-neutral-grey-500"
              onClick={handleToggleShow}
            >
              {!show ? <Icon icon="hugeicons:view" /> : null}
              {show ? <Icon icon="hugeicons:view-off-slash" /> : null}
            </button>
          ) : null}
        </div>

        {/* MESSAGE */}
        <ErrorText error={error} />
      </div>
    );
  },
);

export function InputPrefixIconWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-block pr-2 mr-2 border-r border-neutral-grey-200 text-neutral-grey-300">
      {children}
    </span>
  );
}
