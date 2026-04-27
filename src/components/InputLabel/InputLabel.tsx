import React from 'react';
import { Text } from '../Text';
import { cn } from '../../libs/cn';



type Props = {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
} & React.HTMLAttributes<HTMLLabelElement>;

export function InputLabel({ children, className, htmlFor, ...props }: Props) {
  return (
    <Text
      as="label"
      variant="span"
      weight="medium"
      className={cn(
        'mb-1 inline-block leading-[1.5] text-neutral-grey-600',
        className,
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </Text>
  );
}
