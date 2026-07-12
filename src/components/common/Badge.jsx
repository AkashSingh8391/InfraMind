import { classNames } from '../../utils/helpers';

export default function Badge({ children, className }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        className
      )}
    >
      {children}
    </span>
  );
}
