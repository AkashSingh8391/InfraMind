import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(
  ({ label, error, hint, className, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="label">{label}</label>}
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
          )}
          <input
            ref={ref}
            className={classNames(
              'input-field',
              Icon && 'pl-9',
              error && 'border-danger-500 focus:border-danger-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
        {!error && hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
