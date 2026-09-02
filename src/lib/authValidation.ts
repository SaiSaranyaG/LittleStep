export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formattedNumber?: string;
  expectedDigits?: number | string;
  currentDigitsCount: number;
}

export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
  label: string;
  color: string;
}

export interface CountryPhoneRule {
  code: string;
  country: string;
  flag: string;
  minLength: number;
  maxLength: number;
  example: string;
  pattern?: RegExp;
  hint: string;
}

export const SUPPORTED_COUNTRIES: CountryPhoneRule[] = [
  {
    code: '+91',
    country: 'India',
    flag: '🇮🇳',
    minLength: 10,
    maxLength: 10,
    example: '98765 43210',
    pattern: /^[6-9]\d{9}$/,
    hint: '10 digits starting with 6, 7, 8, or 9',
  },
  {
    code: '+1',
    country: 'United States / Canada',
    flag: '🇺🇸',
    minLength: 10,
    maxLength: 10,
    example: '415 555 2671',
    pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    hint: '10 digits with valid area code',
  },
  {
    code: '+44',
    country: 'United Kingdom',
    flag: '🇬🇧',
    minLength: 10,
    maxLength: 11,
    example: '7911 123456',
    pattern: /^7\d{9}$/,
    hint: '10-11 digits (mobile starts with 7)',
  },
  {
    code: '+61',
    country: 'Australia',
    flag: '🇦🇺',
    minLength: 9,
    maxLength: 9,
    example: '412 345 678',
    pattern: /^4\d{8}$/,
    hint: '9 digits (mobile starts with 4)',
  },
  {
    code: '+49',
    country: 'Germany',
    flag: '🇩🇪',
    minLength: 10,
    maxLength: 11,
    example: '151 23456789',
    pattern: /^1[5-7]\d{8,9}$/,
    hint: '10-11 digits (starts with 15, 16, or 17)',
  },
  {
    code: '+33',
    country: 'France',
    flag: '🇫🇷',
    minLength: 9,
    maxLength: 9,
    example: '6 12 34 56 78',
    pattern: /^[67]\d{8}$/,
    hint: '9 digits starting with 6 or 7',
  },
  {
    code: '+81',
    country: 'Japan',
    flag: '🇯🇵',
    minLength: 10,
    maxLength: 10,
    example: '90 1234 5678',
    pattern: /^[789]0\d{8}$/,
    hint: '10 digits starting with 70, 80, or 90',
  },
  {
    code: '+65',
    country: 'Singapore',
    flag: '🇸🇬',
    minLength: 8,
    maxLength: 8,
    example: '8123 4567',
    pattern: /^[89]\d{7}$/,
    hint: '8 digits starting with 8 or 9',
  },
  {
    code: '+971',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    minLength: 9,
    maxLength: 9,
    example: '50 123 4567',
    pattern: /^5\d{8}$/,
    hint: '9 digits starting with 5',
  },
  {
    code: '+55',
    country: 'Brazil',
    flag: '🇧🇷',
    minLength: 10,
    maxLength: 11,
    example: '11 98765 4321',
    pattern: /^\d{2}9?\d{8}$/,
    hint: '10-11 digits with 2-digit area code',
  },
];

/**
 * Validate an email address with granular checks and feedback
 */
export function validateEmail(rawEmail: string): EmailValidationResult {
  const email = rawEmail.trim();

  if (!email) {
    return {
      isValid: false,
      error: 'Email address is required.',
    };
  }

  if (email.includes(' ')) {
    return {
      isValid: false,
      error: 'Email address cannot contain spaces.',
    };
  }

  if (!email.includes('@')) {
    return {
      isValid: false,
      error: 'Email is missing the "@" symbol (e.g. name@example.com).',
    };
  }

  const parts = email.split('@');
  if (parts.length > 2) {
    return {
      isValid: false,
      error: 'Email contains multiple "@" symbols.',
    };
  }

  const [username, domain] = parts;

  if (!username) {
    return {
      isValid: false,
      error: 'Please enter the username part before the "@" symbol.',
    };
  }

  if (!domain) {
    return {
      isValid: false,
      error: 'Please enter a domain after the "@" symbol (e.g. gmail.com).',
    };
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      error: 'Domain must include an extension like .com, .org, or .in (e.g. example.com).',
    };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  if (tld.length < 2) {
    return {
      isValid: false,
      error: 'Domain extension is too short (must be at least 2 letters, e.g. .com, .io).',
    };
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    return {
      isValid: false,
      error: 'Domain cannot start or end with a dot.',
    };
  }

  const fullEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!fullEmailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid, standard email format (e.g. name@example.com).',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validate a phone number for a specific country code
 */
export function validatePhoneNumber(rawNumber: string, countryCode: string): PhoneValidationResult {
  const digitsOnly = rawNumber.replace(/\D/g, '');
  const rule = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);

  if (!digitsOnly) {
    return {
      isValid: false,
      error: 'Phone number is required.',
      expectedDigits: rule ? (rule.minLength === rule.maxLength ? rule.minLength : `${rule.minLength}-${rule.maxLength}`) : '7-15',
      currentDigitsCount: 0,
    };
  }

  // Check for dummy repeating digits (e.g. 0000000000, 1111111111)
  if (/^(\d)\1{6,}$/.test(digitsOnly)) {
    return {
      isValid: false,
      error: 'Please enter a real phone number, not repeating identical digits.',
      currentDigitsCount: digitsOnly.length,
    };
  }

  // Check for sequential dummy numbers (e.g. 1234567890, 0123456789)
  if (digitsOnly === '1234567890' || digitsOnly === '0123456789' || digitsOnly === '9876543210') {
    return {
      isValid: false,
      error: 'Please enter an active, real phone number.',
      currentDigitsCount: digitsOnly.length,
    };
  }

  if (rule) {
    const expected = rule.minLength === rule.maxLength ? `${rule.minLength}` : `${rule.minLength}-${rule.maxLength}`;

    if (digitsOnly.length < rule.minLength) {
      const remaining = rule.minLength - digitsOnly.length;
      return {
        isValid: false,
        error: `Phone number is too short for ${rule.country}. Needs ${remaining} more digit${remaining > 1 ? 's' : ''} (${digitsOnly.length}/${rule.minLength}).`,
        expectedDigits: expected,
        currentDigitsCount: digitsOnly.length,
      };
    }

    if (digitsOnly.length > rule.maxLength) {
      return {
        isValid: false,
        error: `Phone number is too long for ${rule.country} (max ${rule.maxLength} digits). Currently has ${digitsOnly.length} digits.`,
        expectedDigits: expected,
        currentDigitsCount: digitsOnly.length,
      };
    }

    if (rule.pattern && !rule.pattern.test(digitsOnly)) {
      return {
        isValid: false,
        error: `Invalid format for ${rule.country}. ${rule.hint}. Example: ${rule.example}`,
        expectedDigits: expected,
        currentDigitsCount: digitsOnly.length,
      };
    }

    return {
      isValid: true,
      formattedNumber: `${countryCode} ${digitsOnly}`,
      expectedDigits: expected,
      currentDigitsCount: digitsOnly.length,
    };
  }

  // Fallback generic check (7 to 15 digits according to ITU-T E.164)
  if (digitsOnly.length < 7) {
    return {
      isValid: false,
      error: 'Phone number is too short (minimum 7 digits).',
      expectedDigits: '7-15',
      currentDigitsCount: digitsOnly.length,
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Phone number exceeds standard international limit of 15 digits.',
      expectedDigits: '7-15',
      currentDigitsCount: digitsOnly.length,
    };
  }

  return {
    isValid: true,
    formattedNumber: `${countryCode} ${digitsOnly}`,
    expectedDigits: '7-15',
    currentDigitsCount: digitsOnly.length,
  };
}

/**
 * Validate password requirements and strength score
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required.',
      strength: 'weak',
      score: 0,
      label: 'Empty',
      color: 'bg-slate-700 text-slate-400',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long.',
      strength: 'weak',
      score: 1,
      label: 'Too Short (min 6 chars)',
      color: 'bg-rose-500 text-rose-300',
    };
  }

  let score = 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      isValid: true,
      strength: 'weak',
      score: 1,
      label: 'Weak',
      color: 'bg-rose-500 text-rose-300',
    };
  } else if (score === 2) {
    return {
      isValid: true,
      strength: 'fair',
      score: 2,
      label: 'Fair',
      color: 'bg-amber-500 text-amber-300',
    };
  } else if (score === 3) {
    return {
      isValid: true,
      strength: 'good',
      score: 3,
      label: 'Good',
      color: 'bg-teal-500 text-teal-300',
    };
  } else {
    return {
      isValid: true,
      strength: 'strong',
      score: 4,
      label: 'Strong',
      color: 'bg-emerald-500 text-emerald-300',
    };
  }
}
