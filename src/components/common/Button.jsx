import { classNames } from '../../utils/helpers';

const VARIANTS = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  icon: Icon,
  className,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(VARIANTS[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
}
