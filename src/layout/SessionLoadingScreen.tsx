import { viewportMinHeightClassName } from '@/layout/layoutStyles';

export function SessionLoadingScreen() {
  return (
    <main
      className={`grid ${viewportMinHeightClassName} place-items-center bg-[#f9fafa]`}
    >
      <p className="text-sm text-neutral-grey-500">Loading...</p>
    </main>
  );
}
