import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Textarea = forwardRef(({ label, error, rows = 4, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={classNames(
        'input-field resize-none',
        error && 'border-danger-500 focus:border-danger-500',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
export default Textarea;
