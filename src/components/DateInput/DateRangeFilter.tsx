import DatePicker from 'react-datepicker';

import dayjs from 'dayjs';

import { Button } from '@/components';
import { cn, Icon } from '@/libs';

export function DateRangeFilter({
  startDate,
  endDate,
  onChange,
  placeholder = 'Date',
  format = 'DD-MM-YYYY',
  maxDate,
  showButtonIcon = true,
  iconClassName,
}: {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  placeholder?: string;
  format?: string;
  maxDate?: Date;
  showButtonIcon?: boolean;
  iconClassName?: string;
}) {
  return (
    <div className="relative w-max">
      <DatePicker
        showPopperArrow={false}
        selectsRange
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        maxDate={maxDate}
        customInput={
          <Button
            variant="outline"
            as="span"
            className={cn('font-normal w-max cursor-default', {
              'font-medium': startDate && endDate,
            })}
            iconPosition="right"
            icon={showButtonIcon ? 'hugeicons:arrow-down-01' : ''}
            iconProps={{ width: '18' }}
          >
            <Icon icon="hugeicons:calendar-04" className={iconClassName} />

            {startDate && endDate
              ? `${dayjs(startDate).format(format)} - ${dayjs(endDate).format(format)}`
              : `${placeholder}`}
          </Button>
        }
        onChange={onChange}
      />
      {(startDate || endDate) && (
        <button
          className="absolute grid w-6 h-6 bg-white rounded-full right-4 top-3 place-content-center"
          onClick={() => onChange([null, null])}
          aria-label="clear date range"
        >
          <Icon icon="hugeicons:cancel-01" width={16} />
        </button>
      )}
    </div>
  );
}
