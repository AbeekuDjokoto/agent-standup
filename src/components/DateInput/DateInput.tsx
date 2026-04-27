import DatePicker, { DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.scss';

import { cn, Icon } from '@/libs';

import { InputPrefixIconWrapper } from '../Input';
import { InputLabel } from '../InputLabel';
import { ErrorText } from '../Text';

type Props = Readonly<
  {
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
    [other: string]: any;
  }
>;
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
    ...rest
  } = props;
  return (
    <div>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <div
        className={cn(
          'flex items-center border rounded-lg overflow-hidden border-neutral-grey-200 focus-within:border-brand-primary px-4',
          innerClassName,
          { 'outline-none border-semantics-red': error },
        )}
      >
        {showIcon && (
          <InputPrefixIconWrapper>
            <Icon icon="hugeicons:calendar-04" />
          </InputPrefixIconWrapper>
        )}

        <DatePicker
          disabled={disabled}
          selected={(value ?? null) as Date | null}
          onChange={onChange as any}
          placeholderText={placeholder}
          dateFormat={dateFormat}
          id={id}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          {...rest}
        />
      </div>
      <ErrorText error={error} />
    </div>
  );
}
