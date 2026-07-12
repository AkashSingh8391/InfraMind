export const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address',
  },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    message: 'Include uppercase, lowercase, and a number',
  },
};

export const phoneRules = {
  required: 'Phone number is required',
  pattern: {
    value: /^[6-9]\d{9}$/,
    message: 'Enter a valid 10-digit Indian mobile number',
  },
};

export const requiredRule = (label = 'This field') => ({
  required: `${label} is required`,
});
