import { classNames } from '../../utils/helpers';

export function Card({ children, className, ...props }) {
  return (
    <div className={classNames('card p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, accent = 'pulse' }) {
  const accentClasses = {
    pulse: 'bg-pulse-600/10 text-pulse-600 dark:text-pulse-300',
    signal: 'bg-signal-500/10 text-signal-600',
    ok: 'bg-ok-500/10 text-ok-600',
    warn: 'bg-warn-500/10 text-warn-600',
  };

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
        <p className="mt-1.5 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          {value}
        </p>
        {trend && (
          <p
            className={classNames(
              'mt-1 text-xs font-medium',
              trend.startsWith('-') ? 'text-danger-500' : 'text-ok-600'
            )}
          >
            {trend}
          </p>
        )}
      </div>
      {Icon && (
        <div className={classNames('rounded-lg p-3', accentClasses[accent])}>
          <Icon size={22} />
        </div>
      )}
    </Card>
  );
}
