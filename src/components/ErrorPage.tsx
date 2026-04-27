import React from 'react';
import { useRouteError } from 'react-router-dom';

import { cn } from '../libs/cn';

import { ErrorText } from './Text';
type Props = Readonly<{
  className?: string;
}>;
export default function ErrorPage({ className }: Props) {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className={cn('center flex-col h-full text-center', className)}>
      <h1 className="text-neutral-grey-600">Oops!</h1>
      <p className="text-neutral-grey-600">
        Sorry, an unexpected error has occurred.
      </p>
      <ErrorText error={error.statusText || error.message} />
    </div>
  );
}
