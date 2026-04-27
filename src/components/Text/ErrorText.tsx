import React from 'react';
import { Text } from './Text';
import { cn } from '../../libs/cn';
import { Icon } from '../../libs/icon';

type Props = Readonly<{
  error?: string | { message: string } | boolean;
  className?: string;
}>;

export function ErrorText({ error, className }: Props) {
  return error && typeof error !== 'boolean' ? (
    <div className="mt-2 flex items-center gap-1">
      <Icon
        icon="hugeicons:information-circle"
        className="text-xl text-semantics-red"
      />
      <Text variant="span" className={cn('text-semantics-red', className)}>
        {typeof error === 'string' ? error : error?.message}
      </Text>
    </div>
  ) : null;
}
