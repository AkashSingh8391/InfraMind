export const ROLES = {
  CITIZEN: 'CITIZEN',
  OFFICER: 'OFFICER',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
};

export const COMPLAINT_CATEGORIES = [
  { value: 'POTHOLE', label: 'Pothole', icon: '🕳️' },
  { value: 'STREET_LIGHT', label: 'Broken Street Light', icon: '💡' },
  { value: 'GARBAGE', label: 'Garbage Dumping', icon: '🗑️' },
  { value: 'WATER_LEAKAGE', label: 'Water Leakage', icon: '💧' },
  { value: 'DAMAGED_ROAD', label: 'Damaged Road', icon: '🛣️' },
  { value: 'ILLEGAL_PARKING', label: 'Illegal Parking', icon: '🚗' },
  { value: 'TRAFFIC_SIGNAL', label: 'Broken Traffic Signal', icon: '🚦' },
  { value: 'SEWER_OVERFLOW', label: 'Sewer Overflow', icon: '🚰' },
  { value: 'FALLEN_TREE', label: 'Fallen Tree', icon: '🌳' },
  { value: 'PUBLIC_PROPERTY_DAMAGE', label: 'Public Property Damage', icon: '🏛️' },
  { value: 'OTHER', label: 'Other', icon: '📋' },
];

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  REOPENED: 'REOPENED',
};

export const STATUS_STYLES = {
  PENDING: { label: 'Pending', className: 'bg-warn-500/10 text-warn-600 dark:text-warn-500' },
  ACCEPTED: { label: 'Accepted', className: 'bg-pulse-500/10 text-pulse-600 dark:text-pulse-300' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-signal-500/10 text-signal-600 dark:text-signal-500' },
  RESOLVED: { label: 'Resolved', className: 'bg-ok-500/10 text-ok-600 dark:text-ok-500' },
  REJECTED: { label: 'Rejected', className: 'bg-danger-500/10 text-danger-600 dark:text-danger-500' },
  REOPENED: { label: 'Reopened', className: 'bg-signal-500/10 text-signal-600 dark:text-signal-500' },
};

export const PRIORITY_LEVELS = {
  LOW: { label: 'Low', className: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-100' },
  MEDIUM: { label: 'Medium', className: 'bg-warn-500/10 text-warn-600' },
  HIGH: { label: 'High', className: 'bg-signal-500/10 text-signal-600' },
  CRITICAL: { label: 'Critical', className: 'bg-danger-500/10 text-danger-600' },
};

export const DASHBOARD_ROUTES = {
  CITIZEN: '/citizen/dashboard',
  OFFICER: '/officer/dashboard',
  MANAGER: '/manager/dashboard',
  ADMIN: '/admin/dashboard',
};
