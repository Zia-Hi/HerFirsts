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
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
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

export const useAuthStore = create<AuthStoreState & AuthStoreActions>((set, get) => ({
  user: null,
  gameProgress: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      set({
        user: { id: data.id, username: data.username, email: data.email },
        gameProgress: data.gameProgress || initialGameProgress,
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
      set({
        user: { id: data.id, username: data.username, email: data.email },
        gameProgress: initialGameProgress,
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
    set({
      user: null,
      gameProgress: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        set({
          user: { id: data.id, username: data.username, email: data.email },
          gameProgress: data.gameProgress || initialGameProgress,
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

  clearError: () => set({ error: null }),
}));
