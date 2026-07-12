import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const Select = forwardRef(({ label, error, options = [], placeholder, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={classNames(
          'input-field appearance-none pr-9',
          error && 'border-danger-500 focus:border-danger-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.icon ? `${opt.icon} ` : ''}
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
    </div>
    {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
