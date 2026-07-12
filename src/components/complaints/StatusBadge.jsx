import Badge from '../common/Badge.jsx';
import { STATUS_STYLES, PRIORITY_LEVELS } from '../../utils/constants';

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return <Badge className={style.className}>{style.label}</Badge>;
}

export function PriorityBadge({ priority }) {
  const style = PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.LOW;
  return <Badge className={style.className}>{style.label} priority</Badge>;
}
