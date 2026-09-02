import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export type AuthStatus = 'AUTH_LOADING' | 'AUTHENTICATED' | 'NOT_AUTHENTICATED';

export interface PendingAuthAction {
  type: 'navigate_tab' | 'space_scan' | 'plant_health' | 'plant_recommend' | 'chat' | 'adopt_plant' | 'custom';
  targetTab?: string;
  payload?: any;
  title?: string;
  description?: string;
  onExecute?: () => void;
}

export interface AuthGateContext {
  title?: string;
  message?: string;
  actionType?: string;
  targetTab?: string;
  onExecute?: () => void;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authMethod: 'email' | 'phone';
  authError: string | null;
  emailVerificationSent: boolean;
  emailCooldownSeconds: number;
  otpCooldownSeconds: number;
  confirmationResult: ConfirmationResult | null;
  phoneOtpSessionToken?: string | null;
  activePhoneNumber: string | null;
  isAuthGateOpen: boolean;
  authGateContext: AuthGateContext | null;
  pendingAction: PendingAuthAction | null;
  openAuthModal: (mode?: 'login' | 'register', method?: 'email' | 'phone') => void;
  closeAuthModal: () => void;
  openAuthGate: (context?: AuthGateContext) => void;
  closeAuthGate: () => void;
  setPendingAction: (action: PendingAuthAction | null) => void;
  executePendingAction: () => void;
  getAuthIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  setAuthMethod: (method: 'email' | 'phone') => void;
  clearAuthError: () => void;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  sendPhoneOtp: (phoneNumber: string, appVerifier?: RecaptchaVerifier | null) => Promise<any>;
  verifyPhoneOtp: (otp: string, customDisplayName?: string) => Promise<boolean>;
  resetPhoneOtp: () => void;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Firebase error codes to warm, user-friendly messages
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password you entered is incorrect. Please check and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Please choose a stronger password with at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number including your country code (e.g. +91 or +1).';
    case 'auth/missing-phone-number':
      return 'Please enter your phone number to receive the verification code.';
    case 'auth/invalid-verification-code':
      return 'The 6-digit verification code entered is incorrect. Please double-check your SMS and try again.';
    case 'auth/code-expired':
      return 'The verification code has expired. Please tap Resend to request a fresh code.';
    case 'auth/session-expired':
      return 'The verification session has expired. Please request a new SMS code.';
    case 'auth/too-many-requests':
      return 'Too many attempts. For your protection, please wait a moment before trying again.';
    case 'auth/quota-exceeded':
      return 'SMS verification quota exceeded for this project. Please sign in with Email or try again later.';
    case 'auth/captcha-check-failed':
      return 'Security verification (reCAPTCHA) failed. Please refresh the page and try again.';
    case 'auth/operation-not-allowed':
      return 'Phone authentication is currently disabled in your Firebase console. Please enable Phone provider in Authentication settings.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/requires-recent-login':
      return 'For security, please sign in again before performing this action.';
    default:
      return 'Verification could not be completed. Please check your details and try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState<boolean>(false);
  const [emailCooldownSeconds, setEmailCooldownSeconds] = useState<number>(0);
  const [otpCooldownSeconds, setOtpCooldownSeconds] = useState<number>(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneOtpSessionToken, setPhoneOtpSessionToken] = useState<string | null>(null);
  const [activePhoneNumber, setActivePhoneNumber] = useState<string | null>(null);

  // Auth gate prompt and pending action states
  const [isAuthGateOpen, setIsAuthGateOpen] = useState<boolean>(false);
  const [authGateContext, setAuthGateContext] = useState<AuthGateContext | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAuthAction | null>(null);

  // Derived auth state
  const authStatus: AuthStatus = loading
    ? 'AUTH_LOADING'
    : user
    ? 'AUTHENTICATED'
    : 'NOT_AUTHENTICATED';
  const isAuthenticated = Boolean(user);

  // Restore phone authentication session on startup if present
  useEffect(() => {
    const savedUserStr = localStorage.getItem('littlestep_phone_user');
    const savedToken = localStorage.getItem('littlestep_phone_token');
    if (savedUserStr && !auth.currentUser) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.uid) {
          setUser({
            uid: savedUser.uid,
            phoneNumber: savedUser.phoneNumber,
            displayName: savedUser.displayName,
            email: null,
            emailVerified: false,
            getIdToken: async () => savedToken || '',
          } as any);
          setUserProfile(savedUser);
        }
      } catch (e) {
        console.warn('Error loading cached phone session:', e);
      }
    }
  }, []);

  // Execute and clear any pending action after successful authentication
  const executePendingAction = useCallback(() => {
    if (pendingAction?.onExecute) {
      try {
        pendingAction.onExecute();
      } catch (err) {
        console.warn('Could not execute pending action:', err);
      }
    }
    setPendingAction(null);
    setAuthGateContext(null);
  }, [pendingAction]);

  // Open & Close friendly Auth Gate
  const openAuthGate = useCallback((context?: AuthGateContext) => {
    if (context) {
      setAuthGateContext(context);
      if (context.actionType || context.targetTab || context.onExecute) {
        setPendingAction({
          type: (context.actionType as any) || 'navigate_tab',
          targetTab: context.targetTab,
          title: context.title,
          description: context.message,
          onExecute: context.onExecute,
        });
      }
    }
    setIsAuthGateOpen(true);
  }, []);

  const closeAuthGate = useCallback(() => {
    setIsAuthGateOpen(false);
  }, []);

  // Secure Auth Token retrieval (Firebase ID Token or LittleStep Signed Phone Token)
  const getAuthIdToken = useCallback(async (forceRefresh = false): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken(forceRefresh);
      } catch (err) {
        console.warn('Failed to retrieve Firebase ID Token:', err);
      }
    }
    const phoneToken = localStorage.getItem('littlestep_phone_token');
    if (phoneToken) {
      return phoneToken;
    }
    return null;
  }, []);

  // Handle email resend cooldown countdown
  useEffect(() => {
    if (emailCooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setEmailCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailCooldownSeconds]);

  // Handle OTP resend cooldown countdown
  useEffect(() => {
    if (otpCooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldownSeconds]);

  // Sync / create UserProfile document in Firestore
  const syncUserProfile = useCallback(async (firebaseUser: User, providerOverride?: 'email' | 'phone', customPhone?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userRef);

      const now = new Date().toISOString();
      const phoneToUse = customPhone || activePhoneNumber || firebaseUser.phoneNumber || null;

      if (docSnap.exists()) {
        const existingData = docSnap.data() as UserProfile;
        const updated: UserProfile = {
          ...existingData,
          email: firebaseUser.email || existingData.email,
          phoneNumber: phoneToUse || existingData.phoneNumber,
          displayName:
            existingData.displayName ||
            firebaseUser.displayName ||
            (phoneToUse ? `Gardener (${phoneToUse.slice(-4)})` : firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Plant Caretaker'),
          photoURL: firebaseUser.photoURL || existingData.photoURL,
          lastLoginAt: now,
        };
        await updateDoc(userRef, {
          lastLoginAt: now,
          phoneNumber: phoneToUse || existingData.phoneNumber || null,
        });
        setUserProfile(updated);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          phoneNumber: phoneToUse,
          displayName:
            firebaseUser.displayName ||
            (phoneToUse ? `Gardener (${phoneToUse.slice(-4)})` : firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Plant Caretaker'),
          photoURL: firebaseUser.photoURL || undefined,
          authProvider: providerOverride || (phoneToUse ? 'phone' : 'email'),
          createdAt: now,
          lastLoginAt: now,
          onboardingCompleted: false,
          experienceLevel: 'beginner',
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not sync Firestore profile:', err);
      const phoneToUse = customPhone || activePhoneNumber || firebaseUser.phoneNumber || null;
      // Fallback local profile in memory if Firestore is offline or cold
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || null,
        phoneNumber: phoneToUse,
        displayName:
          firebaseUser.displayName ||
          (phoneToUse ? `Gardener (${phoneToUse.slice(-4)})` : firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Plant Caretaker'),
        authProvider: providerOverride || (phoneToUse ? 'phone' : 'email'),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        onboardingCompleted: false,
      });
    }
  }, [activePhoneNumber]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
        // If there was a pending action waiting for auth, close modals & execute
        setIsAuthModalOpen(false);
        setIsAuthGateOpen(false);
        if (pendingAction?.onExecute) {
          try {
            pendingAction.onExecute();
          } catch (e) {
            console.warn('Failed executing pending auth action:', e);
          }
          setPendingAction(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncUserProfile, pendingAction]);

  const openAuthModal = (mode: 'login' | 'register' = 'register', method: 'email' | 'phone' = 'email') => {
    setAuthModalMode(mode);
    setAuthMethod(method);
    setAuthError(null);
    setConfirmationResult(null);
    setIsAuthGateOpen(false);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
    setConfirmationResult(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Sign up with Email + Password
  const signUpWithEmail = async (email: string, password: string, displayName?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName && displayName.trim()) {
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
      }
      // Send verification email
      try {
        await sendEmailVerification(userCredential.user);
        setEmailVerificationSent(true);
        setEmailCooldownSeconds(60);
      } catch (e) {
        console.warn('Verification email dispatch notice:', e);
      }

      await syncUserProfile(userCredential.user, 'email');
      closeAuthModal();
      setIsAuthGateOpen(false);
      executePendingAction();
      return true;
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err.code || ''));
      return false;
    }
  };

  // Sign in with Email + Password
  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await syncUserProfile(userCredential.user, 'email');
      closeAuthModal();
      setIsAuthGateOpen(false);
      executePendingAction();
      return true;
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err.code || ''));
      return false;
    }
  };

  // Send Email Verification
  const sendVerificationEmail = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    if (emailCooldownSeconds > 0) return false;

    setAuthError(null);
    try {
      await sendEmailVerification(auth.currentUser);
      setEmailVerificationSent(true);
      setEmailCooldownSeconds(60);
      return true;
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err.code || ''));
      return false;
    }
  };

  // Password Reset
  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err.code || ''));
      return false;
    }
  };

  // Send Phone OTP using Firebase signInWithPhoneNumber with graceful server fallback
  const sendPhoneOtp = async (
    phoneNumber: string,
    appVerifier?: RecaptchaVerifier | null
  ): Promise<any> => {
    setAuthError(null);
    const cleanedPhone = phoneNumber.trim();
    setActivePhoneNumber(cleanedPhone);

    // 1. If an appVerifier is supplied, try Firebase client SDK first
    if (appVerifier) {
      try {
        const result = await signInWithPhoneNumber(auth, cleanedPhone, appVerifier);
        setConfirmationResult(result);
        setPhoneOtpSessionToken(null);
        setOtpCooldownSeconds(60);
        return result;
      } catch (err: any) {
        console.warn('Firebase client phone auth notice (e.g. provider disabled or captcha skipped):', err?.code || err);
        // If not a phone format error, we proceed to direct service fallback
        if (err?.code === 'auth/invalid-phone-number') {
          const friendlyMsg = getFriendlyAuthErrorMessage(err.code);
          setAuthError(friendlyMsg);
          throw new Error(friendlyMsg);
        }
      }
    }

    // 2. Server-Side Phone OTP Dispatch Fallback
    try {
      const resp = await fetch('/api/auth/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanedPhone }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        const errMsg = data.error || 'Failed to dispatch verification code.';
        setAuthError(errMsg);
        throw new Error(errMsg);
      }

      setPhoneOtpSessionToken(data.sessionToken);
      setOtpCooldownSeconds(60);

      // Create a compatible confirmation result object
      const fallbackResult = {
        confirm: async (code: string) => {
          const ok = await verifyPhoneOtp(code);
          if (!ok) {
            throw new Error('Invalid verification code.');
          }
          return { user: auth.currentUser } as any;
        },
      };

      setConfirmationResult(fallbackResult as any);
      return fallbackResult;
    } catch (err: any) {
      console.error('Phone OTP dispatch error:', err);
      const friendlyMsg = err?.message || 'Failed to dispatch verification code. Please check your number.';
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Verify Phone OTP using Firebase ConfirmationResult or Server endpoint
  const verifyPhoneOtp = async (otp: string, customDisplayName?: string): Promise<boolean> => {
    setAuthError(null);
    const cleanOtp = otp.trim().replace(/\D/g, '');
    const phoneToVerify = activePhoneNumber;

    if (!cleanOtp || cleanOtp.length < 6) {
      setAuthError('Please enter all 6 digits of the SMS verification code.');
      return false;
    }

    // 1. If we have an active server OTP session token
    if (phoneOtpSessionToken) {
      try {
        const resp = await fetch('/api/auth/phone/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: phoneToVerify,
            otp: cleanOtp,
            sessionToken: phoneOtpSessionToken,
            displayName: customDisplayName,
          }),
        });

        const data = await resp.json();
        if (!resp.ok || !data.success) {
          setAuthError(data.error || 'Invalid verification code.');
          return false;
        }

        if (data.token) {
          localStorage.setItem('littlestep_phone_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('littlestep_phone_user', JSON.stringify(data.user));
          setUserProfile(data.user);
          setUser({
            uid: data.user.uid,
            phoneNumber: data.user.phoneNumber,
            displayName: data.user.displayName,
            email: null,
            emailVerified: false,
            getIdToken: async () => data.token || '',
          } as any);

          // Save user profile to Firestore
          try {
            const userRef = doc(db, 'users', data.user.uid);
            await setDoc(userRef, data.user, { merge: true });
          } catch (fsErr) {
            console.warn('Firestore profile sync for phone user:', fsErr);
          }
        }

        setConfirmationResult(null);
        setPhoneOtpSessionToken(null);
        setOtpCooldownSeconds(0);
        closeAuthModal();
        setIsAuthGateOpen(false);
        executePendingAction();
        return true;
      } catch (err: any) {
        console.error('Server OTP verification error:', err);
        setAuthError(err.message || 'Failed to verify code.');
        return false;
      }
    }

    // 2. Direct Firebase confirmation result
    if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
      setAuthError('Verification session expired. Please request a new SMS code.');
      return false;
    }

    try {
      const userCredential = await confirmationResult.confirm(cleanOtp);
      const firebaseUser = userCredential.user;

      // Update display name if provided and not set
      if (customDisplayName && customDisplayName.trim()) {
        try {
          await updateProfile(firebaseUser, { displayName: customDisplayName.trim() });
        } catch (nameErr) {
          console.warn('Could not set displayName on user object:', nameErr);
        }
      }

      // Synchronize user profile into Firestore
      await syncUserProfile(firebaseUser, 'phone', activePhoneNumber || undefined);

      setConfirmationResult(null);
      setPhoneOtpSessionToken(null);
      setOtpCooldownSeconds(0);
      closeAuthModal();
      setIsAuthGateOpen(false);
      executePendingAction();
      return true;
    } catch (err: any) {
      console.error('Firebase OTP confirmation error:', err);
      const friendlyMsg = getFriendlyAuthErrorMessage(err?.code || '');
      setAuthError(friendlyMsg);
      return false;
    }
  };

  // Reset Phone OTP State
  const resetPhoneOtp = useCallback(() => {
    setConfirmationResult(null);
    setPhoneOtpSessionToken(null);
    setOtpCooldownSeconds(0);
    setAuthError(null);
  }, []);

  // Update Profile
  const updateUserProfileData = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
      return true;
    } catch (err) {
      console.warn('Profile update fallback:', err);
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
      return true;
    }
  };

  // Logout
  const logout = async () => {
    try {
      localStorage.removeItem('littlestep_phone_user');
      localStorage.removeItem('littlestep_phone_token');
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setUserProfile(null);
    setPendingAction(null);
    closeAuthModal();
    closeAuthGate();
  };

  // Account Deletion
  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const uid = user.uid;

      // Clean up all Firestore documents owned by this user
      try {
        const batch = writeBatch(db);
        const collectionsToClean = [
          'spaces',
          'adoptions',
          'care_tasks',
          'health_observations',
          'reward_transactions',
          'air_baselines',
          'agent_logs',
        ];

        for (const colName of collectionsToClean) {
          const q = query(collection(db, colName), where('userId', '==', uid));
          const snap = await getDocs(q);
          snap.forEach((d) => batch.delete(d.ref));
        }

        // Subcollection cleanup under users/{uid}
        const subcollections = [
          'spaces',
          'adoptions',
          'care_tasks',
          'diagnostics',
          'air_baselines',
          'points_transactions',
          'reward_redemptions',
          'preferences',
        ];
        for (const subcol of subcollections) {
          try {
            const subDocs = await getDocs(collection(db, 'users', uid, subcol));
            subDocs.forEach((d) => batch.delete(d.ref));
          } catch (subErr) {
            // subcollection might not exist, proceed
          }
        }

        // Delete root user profile doc
        batch.delete(doc(db, 'users', uid));
        await batch.commit();
      } catch (cleanupErr) {
        console.warn('Firestore user cascade cleanup warning:', cleanupErr);
      }

      // Clear local storage keys
      try {
        localStorage.removeItem('littlestep_phone_user');
        localStorage.removeItem('littlestep_phone_token');
        localStorage.removeItem('littlestep_sustainability_prefs');
        localStorage.removeItem('littlestep_plant_prefs');
        localStorage.removeItem('littlestep_active_space_id');
      } catch (e) {
        // ignore storage errors
      }

      // Delete Firebase Auth User
      await deleteUser(user);
      setUser(null);
      setUserProfile(null);
      setPendingAction(null);
      return true;
    } catch (err: any) {
      setAuthError(getFriendlyAuthErrorMessage(err.code || ''));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authStatus,
        isAuthenticated,
        isAuthModalOpen,
        authModalMode,
        authMethod,
        authError,
        emailVerificationSent,
        emailCooldownSeconds,
        otpCooldownSeconds,
        confirmationResult,
        activePhoneNumber,
        isAuthGateOpen,
        authGateContext,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        openAuthGate,
        closeAuthGate,
        setPendingAction,
        executePendingAction,
        getAuthIdToken,
        setAuthModalMode,
        setAuthMethod,
        clearAuthError,
        signUpWithEmail,
        signInWithEmail,
        sendVerificationEmail,
        sendPasswordReset,
        sendPhoneOtp,
        verifyPhoneOtp,
        resetPhoneOtp,
        updateUserProfileData,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
