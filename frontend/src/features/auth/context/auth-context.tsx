"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AuthContextType,
  AuthResult,
  AuthState,
  NewPasswordData,
  ResetPasswordData,
  SignInCredentials,
  SignUpCredentials,
  User,
} from "../types";

const STORAGE_KEY = "airos_auth_session";
const MOCK_DELAY = 800;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockUser(email: string, displayName: string): User {
  return {
    id: crypto.randomUUID(),
    email,
    displayName,
    avatarUrl: null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };
}

interface StoredSession {
  user: User;
  rememberMe: boolean;
}

function persistSession(user: User, rememberMe: boolean): void {
  const session: StoredSession = { user, rememberMe };
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local) as StoredSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const session = sessionStorage.getItem(STORAGE_KEY);
  if (session) {
    try {
      return JSON.parse(session) as StoredSession;
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  return null;
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const stored = loadSession();
    if (stored?.user) {
      setState({
        user: stored.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<AuthResult> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      await delay(MOCK_DELAY);

      if (!credentials.email || !credentials.password) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: "Email and password are required." };
      }

      if (credentials.password.length < 6) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          error: "Invalid email or password.",
        };
      }

      const user = createMockUser(
        credentials.email,
        credentials.email.split("@")[0]
      );
      user.emailVerified = true;

      persistSession(user, credentials.rememberMe ?? false);
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    },
    []
  );

  const signUp = useCallback(
    async (credentials: SignUpCredentials): Promise<AuthResult> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      await delay(MOCK_DELAY);

      if (
        !credentials.email ||
        !credentials.password ||
        !credentials.displayName
      ) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: "All fields are required." };
      }

      if (!credentials.acceptTerms) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          error: "You must accept the terms and conditions.",
        };
      }

      const user = createMockUser(credentials.email, credentials.displayName);
      persistSession(user, false);
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await delay(MOCK_DELAY / 2);
    clearSession();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const requestPasswordReset = useCallback(
    async (data: ResetPasswordData): Promise<AuthResult> => {
      await delay(MOCK_DELAY);
      if (!data.email) {
        return { success: false, error: "Email is required." };
      }
      return { success: true };
    },
    []
  );

  const resetPassword = useCallback(
    async (data: NewPasswordData): Promise<AuthResult> => {
      await delay(MOCK_DELAY);
      if (data.password !== data.confirmPassword) {
        return { success: false, error: "Passwords do not match." };
      }
      if (data.password.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters.",
        };
      }
      return { success: true };
    },
    []
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await delay(MOCK_DELAY);

    const user = createMockUser("user@gmail.com", "AIROS User");
    user.emailVerified = true;
    user.avatarUrl = null;

    persistSession(user, true);
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      resetPassword,
      signInWithGoogle,
    }),
    [
      state,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      resetPassword,
      signInWithGoogle,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
