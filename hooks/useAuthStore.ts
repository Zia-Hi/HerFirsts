import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email?: string;
}

interface GameProgress {
  completedMissions: string[];
  mission2Started: boolean;
  mission4Started: boolean;
  lightingEventShown: boolean;
  lightingToolsCollected: boolean;
  lightingPrecautionShown: boolean;
  chapter1LetterPending: boolean;
  chapter1LetterShown: boolean;
  chapter2LetterPending: boolean;
  chapter2LetterShown: boolean;
  chapter3LetterPending: boolean;
  chapter3LetterShown: boolean;
  endingShown: boolean;
}

interface AuthStoreState {
  user: User | null;
  gameProgress: GameProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthStoreActions {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  restoreSession: () => void;
}

const initialGameProgress: GameProgress = {
  completedMissions: [],
  mission2Started: false,
  mission4Started: false,
  lightingEventShown: false,
  lightingToolsCollected: false,
  lightingPrecautionShown: false,
  chapter1LetterPending: false,
  chapter1LetterShown: false,
  chapter2LetterPending: false,
  chapter2LetterShown: false,
  chapter3LetterPending: false,
  chapter3LetterShown: false,
  endingShown: false,
};

const SESSION_KEY = "herfirsts-auth-session";

const saveSession = (user: User, gameProgress: GameProgress) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, gameProgress }));
  }
};

const loadSession = (): { user: User; gameProgress: GameProgress } | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    /* ignore parse errors */
  }
  return null;
};

const clearSession = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
  }
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>((set, get) => ({
  user: null,
  gameProgress: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      const user = { id: data.id, username: data.username, email: data.email };
      const gameProgress = data.gameProgress || initialGameProgress;
      
      saveSession(user, gameProgress);
      
      set({
        user,
        gameProgress,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username, password, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      const data = await response.json();
      const user = { id: data.id, username: data.username, email: data.email };
      const gameProgress = initialGameProgress;
      
      saveSession(user, gameProgress);
      
      set({
        user,
        gameProgress,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    clearSession();
    set({
      user: null,
      gameProgress: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const session = loadSession();
    if (session) {
      set({
        user: session.user,
        gameProgress: session.gameProgress,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        const user = { id: data.id, username: data.username, email: data.email };
        const gameProgress = data.gameProgress || initialGameProgress;
        
        saveSession(user, gameProgress);
        
        set({
          user,
          gameProgress,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          gameProgress: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      set({
        user: null,
        gameProgress: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  restoreSession: () => {
    const session = loadSession();
    if (session) {
      set({
        user: session.user,
        gameProgress: session.gameProgress,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
