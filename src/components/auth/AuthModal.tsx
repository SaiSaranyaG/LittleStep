import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  Sprout,
  ShieldCheck,
  Smartphone,
  Send,
  Edit3,
} from 'lucide-react';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import {
  SUPPORTED_COUNTRIES,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
} from '../../lib/authValidation';
import { OtpInput } from './OtpInput';

interface PopMessage {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    authMethod,
    setAuthMethod,
    authError,
    clearAuthError,
    signUpWithEmail,
    signInWithEmail,
    sendVerificationEmail,
    sendPasswordReset,
    sendPhoneOtp,
    verifyPhoneOtp,
    resetPhoneOtp,
    emailVerificationSent,
    emailCooldownSeconds,
    otpCooldownSeconds,
    confirmationResult,
    activePhoneNumber,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Field touch tracking for clean first-load UX
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Pop-up Toast / Alert State
  const [popMessage, setPopMessage] = useState<PopMessage | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Helper to trigger animated pop message
  const triggerPopMessage = (
    type: 'error' | 'success' | 'warning' | 'info',
    title: string,
    message: string,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setPopMessage({
      id: `pop-${Date.now()}`,
      type,
      title,
      message,
      actionLabel,
      onAction,
    });
  };

  const dismissPopMessage = () => {
    setPopMessage(null);
  };

  // Selected Country Rule
  const currentCountryRule = useMemo(() => {
    return (
      SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountryCode) ||
      SUPPORTED_COUNTRIES[0]
    );
  }, [selectedCountryCode]);

  // Real-time Validations
  const emailValidation = useMemo(() => validateEmail(email), [email]);
  const phoneValidation = useMemo(
    () => validatePhoneNumber(phoneNumber, selectedCountryCode),
    [phoneNumber, selectedCountryCode]
  );
  const passwordValidation = useMemo(() => validatePassword(password), [password]);

  const passwordsMatch = useMemo(() => {
    if (!password || !confirmPassword) return false;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Clear form when opening or changing modes
  useEffect(() => {
    if (isAuthModalOpen) {
      clearAuthError();
      setPopMessage(null);
      setPassword('');
      setConfirmPassword('');
      setIsResetMode(false);
      setResetSent(false);
      setEmailTouched(false);
      setPhoneTouched(false);
      setPasswordTouched(false);
      setConfirmPasswordTouched(false);
    }
  }, [isAuthModalOpen, authModalMode, clearAuthError]);

  // Sync auth context errors to pop message
  useEffect(() => {
    if (authError) {
      if (authError.toLowerCase().includes('already exists') || authError.toLowerCase().includes('in use')) {
        triggerPopMessage(
          'error',
          'Account Already Exists',
          authError,
          'Switch to Sign In',
          () => {
            setAuthModalMode('login');
            clearAuthError();
            dismissPopMessage();
          }
        );
      } else if (authError.includes('Phone authentication is currently disabled')) {
        triggerPopMessage(
          'warning',
          'Phone Provider Disabled',
          authError,
          'Switch to Email Sign-in',
          () => {
            setAuthMethod('email');
            clearAuthError();
            dismissPopMessage();
          }
        );
      } else {
        triggerPopMessage('error', 'Authentication Notice', authError);
      }
    }
  }, [authError, clearAuthError, setAuthModalMode, setAuthMethod]);

  // Clean up recaptcha verifier on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  if (!isAuthModalOpen) return null;

  // Initialize reCAPTCHA verifier for phone authentication
  const getRecaptchaVerifier = () => {
    if (!recaptchaContainerRef.current) return null;
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        // ignore reset error
      }
      recaptchaVerifierRef.current = null;
    }

    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        clearAuthError();
        triggerPopMessage('warning', 'Security Check Expired', 'Please tap Send Code again.');
      },
    });

    return recaptchaVerifierRef.current;
  };

  // Handle Email submission (Register or Login)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    dismissPopMessage();
    setEmailTouched(true);
    setPasswordTouched(true);

    // 1. Validate Email
    if (!emailValidation.isValid) {
      triggerPopMessage(
        'error',
        'Invalid Email Address',
        emailValidation.error || 'Please enter a valid email address (e.g. name@example.com).'
      );
      return;
    }

    // 2. Validate Password
    if (!password) {
      triggerPopMessage('error', 'Password Required', 'Please enter your account password.');
      return;
    }

    if (authModalMode === 'register') {
      setConfirmPasswordTouched(true);

      if (password.length < 6) {
        triggerPopMessage(
          'warning',
          'Weak Password',
          'For security, your password must contain at least 6 characters.'
        );
        return;
      }

      if (!passwordsMatch) {
        triggerPopMessage(
          'error',
          'Passwords Do Not Match',
          'The confirmation password does not match. Please re-enter your password carefully.'
        );
        return;
      }

      setIsSubmitting(true);
      const success = await signUpWithEmail(email, password, displayName);
      setIsSubmitting(false);

      if (success) {
        triggerPopMessage(
          'success',
          'Account Created Successfully! 🌱',
          `We have sent an email verification link to ${email}. Please check your inbox and confirm your address to secure your account.`
        );
      }
    } else {
      setIsSubmitting(true);
      const success = await signInWithEmail(email, password);
      setIsSubmitting(false);

      if (success) {
        triggerPopMessage('success', 'Welcome Back!', 'Signing you into your botanical sanctuary...');
      }
    }
  };

  // Handle Password Reset Request
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    dismissPopMessage();

    if (!emailValidation.isValid) {
      triggerPopMessage(
        'error',
        'Invalid Email Address',
        emailValidation.error || 'Please enter the email address linked to your account.'
      );
      return;
    }

    setIsSubmitting(true);
    const success = await sendPasswordReset(email);
    setIsSubmitting(false);

    if (success) {
      setResetSent(true);
      triggerPopMessage(
        'success',
        'Reset Link Sent',
        `Password reset instructions have been dispatched to ${email}.`
      );
    }
  };

  // Handle Send Phone OTP via Firebase Phone Auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);
    dismissPopMessage();

    // Validate Phone Number
    if (!phoneValidation.isValid) {
      triggerPopMessage(
        'error',
        'Invalid Phone Number',
        phoneValidation.error || `Please enter a valid ${currentCountryRule.country} phone number.`
      );
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const fullPhoneNumber = `${selectedCountryCode}${digitsOnly}`;
    setIsSubmitting(true);

    try {
      let verifier: RecaptchaVerifier | null = null;
      try {
        verifier = getRecaptchaVerifier();
      } catch (recaptchaErr) {
        console.warn('reCAPTCHA init notice, proceeding with verification service:', recaptchaErr);
      }

      const result = await sendPhoneOtp(fullPhoneNumber, verifier);
      if (result) {
        setOtp(result.devOtpCode || '');
        const devMsg = result.devOtpCode ? ` [Code: ${result.devOtpCode}]` : '';
        triggerPopMessage(
          'success',
          `Verification Code Generated! 📱${devMsg}`,
          result.devOtpCode
            ? `Your 6-digit verification code is: ${result.devOtpCode}. It has been auto-filled below. Click Verify Code to log in!`
            : `A 6-digit SMS verification code has been dispatched to ${selectedCountryCode} ${digitsOnly}. Please enter the code below.`
        );
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      triggerPopMessage(
        'error',
        'Verification Dispatch Notice',
        err?.message || 'Could not send verification SMS. Please verify your phone number and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Verify Phone OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    dismissPopMessage();

    const cleanOtp = otp.replace(/\D/g, '');

    if (!cleanOtp || cleanOtp.length < 6) {
      triggerPopMessage(
        'warning',
        'Incomplete Verification Code',
        'Please enter all 6 digits of the SMS verification code sent to your phone.'
      );
      return;
    }

    setIsSubmitting(true);
    const success = await verifyPhoneOtp(cleanOtp, displayName || undefined);
    setIsSubmitting(false);

    if (success) {
      triggerPopMessage(
        'success',
        'Phone Verified & Logged In! 🌱',
        'Your mobile number has been authenticated. Welcome to LittleStep!'
      );
    } else {
      triggerPopMessage(
        'error',
        'Verification Failed',
        authError || 'The verification code entered is incorrect or has expired. Please check and try again.'
      );
    }
  };

  return (
    <div
      id="littlestep-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      {/* Invisible reCAPTCHA container */}
      <div ref={recaptchaContainerRef} id="recaptcha-container" />

      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/60 overflow-hidden my-8">
        {/* Glow Accents */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mb-3 shadow-lg">
            <Sprout className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {isResetMode
              ? 'Reset Your Password'
              : user && !user.emailVerified && emailVerificationSent
              ? 'Almost there 🌱'
              : authModalMode === 'register'
              ? 'Create Your Account'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-emerald-300/80 mt-1 font-medium max-w-xs mx-auto">
            {isResetMode
              ? "We'll send you an email with reset instructions."
              : authModalMode === 'register'
              ? 'Start with one mindful step. Verified plant companions & sustainable care.'
              : 'Sign in to access your sanctuary and care schedule.'}
          </p>
        </div>

        {/* DYNAMIC POP MESSAGE / TOAST NOTIFICATION BANNER */}
        {popMessage && (
          <div
            id="auth-pop-message"
            className={`mb-5 p-3.5 rounded-2xl border transition-all animate-fadeIn relative flex items-start gap-3 shadow-lg ${
              popMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-950/50'
                : popMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-400/70 text-emerald-100 shadow-emerald-950/50'
                : popMessage.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-amber-950/50'
                : 'bg-teal-950/90 border-teal-500/60 text-teal-100 shadow-teal-950/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {popMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {popMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {popMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {popMessage.type === 'info' && <Info className="w-5 h-5 text-teal-400" />}
            </div>

            <div className="flex-1 min-w-0 pr-4 text-left">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    popMessage.type === 'error'
                      ? 'bg-rose-900/60 text-rose-300'
                      : popMessage.type === 'success'
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : popMessage.type === 'warning'
                      ? 'bg-amber-900/60 text-amber-300'
                      : 'bg-teal-900/60 text-teal-300'
                  }`}
                >
                  {popMessage.title}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-normal opacity-95">{popMessage.message}</p>

              {popMessage.actionLabel && popMessage.onAction && (
                <button
                  type="button"
                  onClick={popMessage.onAction}
                  className="mt-2 text-xs font-bold underline underline-offset-2 hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
                >
                  <span>{popMessage.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="dismiss-pop-message-btn"
              type="button"
              onClick={dismissPopMessage}
              className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Email Verification Pending Banner */}
        {user && !user.emailVerified && emailVerificationSent && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3 my-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm text-white font-medium">We&apos;ve sent a verification link to:</p>
            <p className="text-xs font-mono font-bold text-emerald-300 bg-slate-950/60 py-1.5 px-3 rounded-lg border border-emerald-800">
              {user.email}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Check your inbox and spam folder. Click the link to complete verification.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                id="resend-verification-btn"
                type="button"
                disabled={emailCooldownSeconds > 0 || isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  const success = await sendVerificationEmail();
                  setIsSubmitting(false);
                  if (success) {
                    triggerPopMessage(
                      'success',
                      'Verification Link Re-sent',
                      `A fresh verification link has been sent to ${user.email}.`
                    );
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-emerald-200 border border-slate-700 transition-colors cursor-pointer"
              >
                {emailCooldownSeconds > 0
                  ? `Resend in ${emailCooldownSeconds}s`
                  : 'Resend Verification Email'}
              </button>
              <button
                id="verification-continue-btn"
                type="button"
                onClick={closeAuthModal}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                I&apos;ve Verified
              </button>
            </div>
          </div>
        )}

        {/* Password Reset Sent Screen */}
        {isResetMode && resetSent ? (
          <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-4 my-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Check Your Inbox</h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              If an account is associated with <strong className="text-white">{email}</strong>, you will
              receive password reset instructions shortly.
            </p>
            <button
              id="back-to-signin-after-reset-btn"
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setResetSent(false);
                setAuthModalMode('login');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        ) : isResetMode ? (
          /* Password Reset Form */
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="reset-email-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
              >
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="reset-email-input"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailTouched(true);
                  }}
                  className={`w-full bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    emailTouched && !emailValidation.isValid
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-700 focus:border-emerald-400'
                  }`}
                />
              </div>
              {emailTouched && (
                <p
                  className={`text-[11px] flex items-center gap-1 ${
                    emailValidation.isValid ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {emailValidation.isValid ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Valid email address</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailValidation.error}</span>
                    </>
                  )}
                </p>
              )}
            </div>

            <button
              id="send-reset-email-btn"
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsResetMode(false)}
              className="w-full text-xs text-slate-400 hover:text-emerald-300 text-center transition-colors cursor-pointer"
            >
              Cancel and return to Sign In
            </button>
          </form>
        ) : (
          /* Normal Auth (Email vs Phone) */
          <div>
            {/* Method Tabs (Email vs Phone) */}
            <div className="flex rounded-2xl bg-slate-950/80 p-1 border border-slate-800 mb-5">
              <button
                id="auth-method-email-tab"
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  clearAuthError();
                  dismissPopMessage();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMethod === 'email'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Continue with Email</span>
              </button>
              <button
                id="auth-method-phone-tab"
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  clearAuthError();
                  dismissPopMessage();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Continue with Phone</span>
              </button>
            </div>

            {/* EMAIL METHOD */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {authModalMode === 'login' ? (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Enter your registered <strong>Email</strong> and <strong>Password</strong> to sign in.</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Create your new account with an email & password (at least 6 characters).</span>
                  </div>
                )}

                {authModalMode === 'register' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-name-input"
                      className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
                    >
                      Your Name or Nickname <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="auth-name-input"
                        type="text"
                        placeholder="e.g. Maya Green"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field with Live Feedback */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="auth-email-input"
                      className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
                    >
                      Email Address
                    </label>
                    {emailTouched && (
                      <span
                        className={`text-[10px] font-bold ${
                          emailValidation.isValid ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {emailValidation.isValid ? '✓ Valid format' : '✕ Incomplete'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      className={`w-full bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        emailTouched && !emailValidation.isValid
                          ? 'border-rose-500 focus:border-rose-400'
                          : emailTouched && emailValidation.isValid
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-slate-700 focus:border-emerald-400'
                      }`}
                    />
                  </div>
                  {emailTouched && !emailValidation.isValid && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{emailValidation.error}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="auth-password-input"
                      className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
                    >
                      Password
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          dismissPopMessage();
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="auth-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordTouched(true);
                      }}
                      onBlur={() => setPasswordTouched(true)}
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-400 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter for Register */}
                  {authModalMode === 'register' && password && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Strength:</span>
                        <span
                          className={`font-semibold ${
                            passwordValidation.score === 1
                              ? 'text-rose-400'
                              : passwordValidation.score === 2
                              ? 'text-amber-400'
                              : passwordValidation.score === 3
                              ? 'text-teal-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {passwordValidation.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full h-full transition-all ${
                              passwordValidation.score >= step
                                ? passwordValidation.score === 1
                                  ? 'bg-rose-500'
                                  : passwordValidation.score === 2
                                  ? 'bg-amber-500'
                                  : passwordValidation.score === 3
                                  ? 'bg-teal-400'
                                  : 'bg-emerald-400'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      {password.length < 6 && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Must be at least 6 characters</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password for Register */}
                {authModalMode === 'register' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="auth-confirm-password-input"
                        className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
                      >
                        Confirm Password
                      </label>
                      {confirmPasswordTouched && confirmPassword && (
                        <span
                          className={`text-[10px] font-bold ${
                            passwordsMatch ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {passwordsMatch ? '✓ Matches' : '✕ Mismatch'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="auth-confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setConfirmPasswordTouched(true);
                        }}
                        onBlur={() => setConfirmPasswordTouched(true)}
                        className={`w-full bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          confirmPasswordTouched && confirmPassword && !passwordsMatch
                            ? 'border-rose-500 focus:border-rose-400'
                            : confirmPasswordTouched && passwordsMatch
                            ? 'border-emerald-500/70 focus:border-emerald-400'
                            : 'border-slate-700 focus:border-emerald-400'
                        }`}
                      />
                    </div>
                    {confirmPasswordTouched && confirmPassword && !passwordsMatch && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Passwords do not match</span>
                      </p>
                    )}
                  </div>
                )}

                <button
                  id="auth-email-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer mt-3"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{authModalMode === 'register' ? 'Creating Account...' : 'Signing You In...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{authModalMode === 'register' ? 'Create Account & Verify' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* PHONE METHOD */}
            {authMethod === 'phone' && (
              <div className="space-y-4">
                {!confirmationResult ? (
                  /* Step 1: Enter Phone Number */
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    {/* Optional Name for Registration */}
                    {authModalMode === 'register' && (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="auth-phone-display-name-input"
                          className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
                        >
                          Your Name (Optional)
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            id="auth-phone-display-name-input"
                            type="text"
                            placeholder="e.g. Maya Lin"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="auth-phone-input"
                          className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
                        >
                          Mobile Number
                        </label>
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            phoneValidation.isValid
                              ? 'text-emerald-400'
                              : phoneTouched && phoneNumber
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {phoneValidation.currentDigitsCount} / {phoneValidation.expectedDigits} digits
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <select
                          id="auth-country-code-select"
                          value={selectedCountryCode}
                          onChange={(e) => {
                            setSelectedCountryCode(e.target.value);
                            dismissPopMessage();
                          }}
                          className="bg-slate-950/80 border border-slate-700 focus:border-emerald-400 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                        >
                          {SUPPORTED_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                              {c.flag} {c.code} ({c.country.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            id="auth-phone-input"
                            type="tel"
                            required
                            placeholder={currentCountryRule.example}
                            value={phoneNumber}
                            onChange={(e) => {
                              setPhoneNumber(e.target.value);
                              setPhoneTouched(true);
                            }}
                            onBlur={() => setPhoneTouched(true)}
                            className={`w-full bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors font-mono ${
                              phoneTouched && phoneNumber && !phoneValidation.isValid
                                ? 'border-amber-500/80 focus:border-amber-400'
                                : phoneTouched && phoneValidation.isValid
                                ? 'border-emerald-500/70 focus:border-emerald-400'
                                : 'border-slate-700 focus:border-emerald-400'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Live Validation Guidance */}
                      <div className="pt-0.5">
                        {phoneTouched && phoneNumber && !phoneValidation.isValid ? (
                          <p className="text-[11px] text-amber-300 flex items-start gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{phoneValidation.error}</span>
                          </p>
                        ) : phoneTouched && phoneValidation.isValid ? (
                          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Valid {currentCountryRule.country} mobile number</span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400">
                            {currentCountryRule.hint}. Example: {currentCountryRule.example}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      id="auth-send-otp-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send 6-Digit Code</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Enter 6-digit SMS OTP using OtpInput */
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {/* Dispatched Number Banner */}
                    <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-center space-y-1">
                      <span className="text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>SMS Verification Code Sent To:</span>
                      </span>
                      <p className="text-base font-mono font-bold text-white tracking-wider">
                        {activePhoneNumber || `${selectedCountryCode} ${phoneNumber}`}
                      </p>
                      <p className="text-[11px] text-emerald-300/70">
                        Enter the 6-digit SMS code delivered to your mobile device:
                      </p>
                    </div>

                    {/* Dedicated OtpInput Component */}
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      length={6}
                      disabled={isSubmitting}
                      hasError={Boolean(authError)}
                      autoFocus={true}
                      onComplete={(completedCode) => {
                        // Automatically attempt verification when all 6 digits are entered
                        if (completedCode.length === 6) {
                          setOtp(completedCode);
                        }
                      }}
                    />

                    {/* Submit Button */}
                    <button
                      id="auth-verify-otp-btn"
                      type="submit"
                      disabled={isSubmitting || otp.replace(/\D/g, '').length < 6}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying & Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>{authModalMode === 'register' ? 'Verify & Create Account' : 'Verify & Sign In'}</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Resend & Change Number Controls */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        disabled={otpCooldownSeconds > 0 || isSubmitting}
                        onClick={handleSendOtp}
                        className="text-emerald-400 hover:text-emerald-300 disabled:text-slate-500 transition-colors cursor-pointer"
                      >
                        {otpCooldownSeconds > 0
                          ? `Resend SMS in ${otpCooldownSeconds}s`
                          : 'Resend SMS code'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOtp('');
                          resetPhoneOtp();
                          dismissPopMessage();
                        }}
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        Change number
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Toggle Mode (Sign In vs Register) */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 text-center">
              {authModalMode === 'register' ? (
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    id="switch-to-login-btn"
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      clearAuthError();
                      dismissPopMessage();
                    }}
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1 cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Don&apos;t have an account yet?{' '}
                  <button
                    id="switch-to-register-btn"
                    type="button"
                    onClick={() => {
                      setAuthModalMode('register');
                      clearAuthError();
                      dismissPopMessage();
                    }}
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1 cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>

            {/* Security & Privacy Notice */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
              <span>Protected by Firebase Authentication with encrypted identity verification.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
