export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    location: string;
    blog: string;
    twitter_username: string;
    company: string;
    created_at: string;
  }
  
  export interface GitHubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
    size: number;
  }
  
  export interface AppState {
    userData: GitHubUser | null;
    repos: GitHubRepo[];
    loading: boolean;
    error: string | null;
    searchHistory: string[];
  }
  
  export interface AppContextType {
    state: AppState;
    searchUser: (username: string) => Promise<void>;
    clearError: () => void;
    clearData: () => void;
    toggleTheme: () => void;
    isDarkMode: boolean;
    hasToken?: boolean;
  }