import React, { useEffect, useState } from 'react';
import DatePicker, { DatePickerProps } from 'react-datepicker';

import { cn, Icon } from '@/libs';

import { InputPrefixIconWrapper } from '../Input';
import { InputLabel } from '../InputLabel';
import { ErrorText } from '../Text';

import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.scss';

type DatePickerTriggerProps = {
  value?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
};

/** Button trigger avoids iOS opening the keyboard alongside the calendar popover. */
const DatePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  DatePickerTriggerProps
>(({ value, onClick, className, disabled, placeholder, id }, ref) => (
  <button
    type="button"
    id={id}
    ref={ref}
    onClick={onClick}
    disabled={disabled}
    className={cn('date-picker-trigger', className)}
    aria-haspopup="dialog"
    aria-label={
      value ? `Selected date: ${value}` : (placeholder ?? 'Choose date')
    }
  >
    {value ? (
      <span className="truncate">{value}</span>
    ) : (
      <span className="truncate text-neutral-grey-300">{placeholder}</span>
    )}
  </button>
));

DatePickerTrigger.displayName = 'DatePickerTrigger';

type Props = Readonly<{
  placeholder?: string;
  value?: Date | null;
  label?: string;
  id?: string;
  error?: string;
  disabled?: boolean;
  dateFormat?: string;
  onChange?: DatePickerProps['onChange'];
  innerClassName?: string;
  showIcon?: boolean;
}>;

export function DateInput(props: Props) {
  const {
    placeholder,
    value,
    label,
    id = 'calendar-id',
    error,
    disabled,
    dateFormat = 'dd, MMM yyyy',
    showIcon = true,
    innerClassName,
    onChange,
  } = props;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div>
      {label ? <InputLabel htmlFor={id}>{label}</InputLabel> : null}
      <div
        className={cn(
          'flex min-w-0 items-center overflow-hidden rounded-lg border border-neutral-grey-200 px-4 focus-within:border-brand-primary',
          innerClassName,
          { 'outline-none border-semantics-red': error },
        )}
      >
        {showIcon ? (
          <InputPrefixIconWrapper>
            <Icon icon="hugeicons:calendar-04" />
          </InputPrefixIconWrapper>
        ) : null}

        <DatePicker
          disabled={disabled}
          selected={(value ?? null) as Date | null}
          onChange={
            onChange as (
              date: Date | null,
              event?:
                | React.MouseEvent<HTMLElement>
                | React.KeyboardEvent<HTMLElement>,
            ) => void
          }
          placeholderText={placeholder}
          dateFormat={dateFormat}
          id={id}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          shouldCloseOnSelect
          withPortal={isMobile}
          popperPlacement="bottom-start"
          popperClassName="date-picker-popper"
          customInput={
            <DatePickerTrigger
              placeholder={placeholder}
              disabled={disabled}
              id={id}
            />
          }
        />
      </div>
      <ErrorText error={error} />
    </div>
  );
}
