import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GitHubUser, GitHubRepo, AppState, AppContextType } from '../types';

// Types
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_DATA'; payload: GitHubUser | null }
  | { type: 'SET_REPOS'; payload: GitHubRepo[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'CLEAR_DATA' };

interface AppProviderProps {
  children: ReactNode;
}

// Constants
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const REPOS_PER_PAGE = 50;
const HISTORY_LIMIT = 5;

// Configuration
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

// Initial State
const initialState: AppState = {
  userData: null,
  repos: [],
  loading: false,
  error: null,
  searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
};

// Cache Service
class CacheService {
  private cache = new Map<string, { data: any; timestamp: number }>();

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// API Service
class GitHubAPIService {
  private cacheService: CacheService;
  private baseURL = 'https://api.github.com';

  constructor(cacheService: CacheService) {
    this.cacheService = cacheService;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    if (GITHUB_TOKEN && GITHUB_TOKEN.trim() !== '') {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `GitHub API error: ${response.status}`;
      } catch {
        errorMessage = `GitHub API error: ${response.status}`;
      }
      
      switch (response.status) {
        case 403:
          throw new Error(
            GITHUB_TOKEN 
              ? 'GitHub API rate limit exceeded with authentication. Please try again later.'
              : 'GitHub API rate limit exceeded. Add a token for higher limits.'
          );
        case 404:
          // Just throw "Not Found" without additional text for easier detection
          throw new Error('Not Found');
        case 429:
          throw new Error('Too many requests. Please wait before searching again.');
        default:
          throw new Error(errorMessage);
      }
    }
  
    return response.json() as Promise<T>;
  }  

  async getUser(username: string): Promise<GitHubUser> {
    const cacheKey = `user_${username}`;
    const cached = this.cacheService.get<GitHubUser>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${this.baseURL}/users/${username}`, {
      headers: this.getHeaders(),
    });

    const userData = await this.handleResponse<GitHubUser>(response);
    this.cacheService.set(cacheKey, userData);
    return userData;
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const cacheKey = `repos_${username}`;
    const cached = this.cacheService.get<GitHubRepo[]>(cacheKey);
    if (cached) return cached;

    const response = await fetch(
      `${this.baseURL}/users/${username}/repos?sort=updated&per_page=${REPOS_PER_PAGE}`,
      { headers: this.getHeaders() }
    );

    const reposData = await this.handleResponse<GitHubRepo[]>(response);
    this.cacheService.set(cacheKey, reposData);
    return reposData;
  }

  async searchUser(username: string): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
    const [user, repos] = await Promise.all([
      this.getUser(username),
      this.getUserRepos(username),
    ]);

    return { user, repos };
  }
}

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'SET_REPOS':
      return { ...state, repos: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_HISTORY':
      const newHistory = [
        action.payload,
        ...state.searchHistory.filter(item => item !== action.payload),
      ].slice(0, HISTORY_LIMIT);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return { ...state, searchHistory: newHistory };
    case 'CLEAR_DATA':
      return { ...state, userData: null, repos: [], error: null };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem('theme') === 'dark'
  );

  const cacheService = React.useMemo(() => new CacheService(), []);
  const apiService = React.useMemo(() => new GitHubAPIService(cacheService), [cacheService]);

  const searchUser = React.useCallback(async (username: string) => {
    if (!username.trim()) return;

    const trimmedUsername = username.trim();
    
    // Validation
    if (trimmedUsername.length < 3) {
      dispatch({ type: 'SET_ERROR', payload: 'Username must be at least 3 characters long' });
      return;
    }

    // Prevent duplicate search
    if (state.userData?.login === trimmedUsername && !state.error) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { user, repos } = await apiService.searchUser(trimmedUsername);
      
      dispatch({ type: 'SET_USER_DATA', payload: user });
      dispatch({ type: 'SET_REPOS', payload: repos });
      dispatch({ type: 'ADD_TO_HISTORY', payload: trimmedUsername });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'Not Found') {
        dispatch({ type: 'SET_ERROR', payload: `User "${trimmedUsername}" not found` });
      } else {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      
      dispatch({ type: 'CLEAR_DATA' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apiService, state.userData?.login, state.error]);

  const clearError = React.useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const clearData = React.useCallback(() => {
    dispatch({ type: 'CLEAR_DATA' });
  }, []);

  const toggleTheme = React.useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }, [isDarkMode]);

  const value: AppContextType = React.useMemo(() => ({
    state,
    searchUser,
    clearError,
    clearData,
    toggleTheme,
    isDarkMode,
    hasToken: !!GITHUB_TOKEN,
  }), [state, searchUser, clearError, clearData, toggleTheme, isDarkMode]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};