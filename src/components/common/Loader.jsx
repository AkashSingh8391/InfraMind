import { classNames } from '../../utils/helpers';

export default function Loader({ fullScreen = false, label = 'Loading…', size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={classNames(
          sizes[size],
          'animate-spin rounded-full border-2 border-ink-200 border-t-pulse-600 dark:border-ink-700'
        )}
      />
      {label && <p className="text-sm text-ink-400">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-ink-50 dark:bg-ink-900">
        {spinner}
      </div>
    );
  }

  return <div className="flex w-full items-center justify-center py-10">{spinner}</div>;
}
