import React, { useRef, useEffect } from 'react';
import { Clipboard, Trash2 } from 'lucide-react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
  autoFocus = true,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of single digits padded to length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Auto-focus first empty input on mount if requested
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleDigitChange = (index: number, newChar: string) => {
    if (disabled) return;

    // Filter to only digits
    const cleaned = newChar.replace(/\D/g, '');

    if (!cleaned) {
      // Empty / cleared
      const newDigits = [...digits];
      newDigits[index] = '';
      const newVal = newDigits.join('');
      onChange(newVal);
      return;
    }

    // If multiple characters (e.g. pasted into single input)
    if (cleaned.length > 1) {
      handlePastedString(cleaned, index);
      return;
    }

    // Single digit input
    const singleDigit = cleaned.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    const newVal = newDigits.join('');
    onChange(newVal);

    // Auto-advance to next input box
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }

    if (newVal.length === length && onComplete) {
      onComplete(newVal);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box and clear it
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        // Clear current box
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePastedString = (pastedText: string, startIndex = 0) => {
    const rawDigits = pastedText.replace(/\D/g, '');
    if (!rawDigits) return;

    const newDigits = [...digits];
    for (let i = 0; i < rawDigits.length && startIndex + i < length; i++) {
      newDigits[startIndex + i] = rawDigits[i];
    }

    const newVal = newDigits.join('').slice(0, length);
    onChange(newVal);

    // Focus the next empty input or last input
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }

    if (newVal.length === length && onComplete) {
      onComplete(newVal);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    handlePastedString(clipboardData, 0);
  };

  const handlePasteClipboardBtn = async () => {
    if (disabled) return;
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        handlePastedString(text, 0);
      }
    } catch {
      // Clipboard read blocked by browser permissions
    }
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
    inputRefs.current[0]?.focus();
  };

  const filledCount = digits.filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Label and Progress */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Enter 6-Digit SMS Code
        </label>
        <span
          className={`text-[11px] font-mono font-bold transition-colors ${
            filledCount === length
              ? 'text-emerald-400'
              : hasError
              ? 'text-rose-400'
              : 'text-slate-400'
          }`}
        >
          {filledCount} / {length} digits
        </span>
      </div>

      {/* 6 Individual Interactive PIN Input Boxes */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2">
        {digits.map((digit, idx) => {
          const isFilled = Boolean(digit);
          return (
            <input
              key={idx}
              id={`auth-otp-digit-${idx}`}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={disabled}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              placeholder="·"
              className={`w-11 h-14 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all focus:outline-none select-all ${
                disabled
                  ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                  : hasError
                  ? 'bg-rose-950/30 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/40 focus:ring-2 focus:ring-rose-500'
                  : isFilled
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/40 focus:ring-2 focus:ring-emerald-400'
                  : 'bg-slate-950/90 border-slate-700 text-slate-200 placeholder:text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50'
              }`}
            />
          );
        })}
      </div>

      {/* Manual Input Actions */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-0.5 pt-0.5">
        <button
          type="button"
          onClick={handlePasteClipboardBtn}
          disabled={disabled}
          className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
        >
          <Clipboard className="w-3 h-3" />
          <span>Paste code</span>
        </button>

        {filledCount > 0 && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-rose-400 hover:text-rose-300 disabled:opacity-50 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
