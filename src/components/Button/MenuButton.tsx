import { cn } from '@/libs';

import { Button } from './Button';

type Props = Readonly<{
  isOpen: boolean;
  setIsOpen: () => void;
  className?: string;
  title?: string;
}>;
export function MenuButton({ isOpen, setIsOpen, className, title }: Props) {
  return (
    <Button
      title={title}
      variant={'outline'}
      size={'medium'}
      iconOnly
      onClick={() => setIsOpen()}
      className={cn('group transmooth flex flex-col gap-1', className)}
    >
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? 'rotate-45 translate-y-[7px]' : ''
        }`}
      />
      <div className={`${genericHamburgerLine} ${isOpen ? 'opacity-0' : ''}`} />
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? '-rotate-45 -translate-y-[7px] ' : ''
        }`}
      />
    </Button>
  );
}
const genericHamburgerLine = `h-[3px] w-6 rounded-full bg-neutral-grey-200 transmooth`;
