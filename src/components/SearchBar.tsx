import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  alpha,
  Typography,
} from '@mui/material';
import {
  Search,
  Clear,
  History,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar: React.FC = () => {
  const { state, searchUser, clearError, clearData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastSearchedTerm, setLastSearchedTerm] = useState('');

  const isClearingRef = useRef(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const isValidSearchTerm = useCallback((term: string) => {
    const trimmedTerm = term.trim();
    return trimmedTerm.length >= 3 && /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(trimmedTerm);
  }, []);

  const shouldSearch = useCallback((term: string, lastTerm: string) => {
    if (isClearingRef.current) return false; // Prevent search if we're clearing
    if (!isValidSearchTerm(term)) return false;
    if (term === lastTerm) return false;
    return true;
  }, [isValidSearchTerm]);

  // Main search effect for debounced input
  useEffect(() => {
    if (isClearingRef.current) return;

    const performSearch = async () => {
      if (shouldSearch(debouncedSearchTerm, lastSearchedTerm)) {
        setLastSearchedTerm(debouncedSearchTerm);
        await searchUser(debouncedSearchTerm);
        setIsTyping(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm, lastSearchedTerm, searchUser, shouldSearch]);

  // Clear data when search term becomes empty
  useEffect(() => {
    if (!searchTerm.trim() && (state.userData || state.repos.length > 0)) {
      clearData();
      setLastSearchedTerm('');
    }
  }, [searchTerm, state.userData, state.repos.length, clearData]);

  // Handle typing state
  useEffect(() => {
    if (searchTerm && searchTerm !== lastSearchedTerm) {
      setIsTyping(true);
    }
  }, [searchTerm, lastSearchedTerm]);

  const handleSearch = async (username: string) => {
    
    setSearchTerm(username);
    setLastSearchedTerm(username);
    setShowHistory(false);
    clearError();
    setIsTyping(false);
    
    // Immediately search when clicking history, bypassing debounce
    if (isValidSearchTerm(username)) {
      await searchUser(username);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear error when user starts typing again
    if (state.error && value !== lastSearchedTerm) {
      clearError();
    }

    // Clear data immediately if input becomes empty and we have data displayed
    if (!value.trim() && (state.userData || state.repos.length > 0)) {
      clearData();
      setLastSearchedTerm('');
    }
  };

  const handleClear = () => {
    isClearingRef.current = true;
    setSearchTerm('');
    setLastSearchedTerm('');
    clearError();
    clearData();
    setIsTyping(false);

    // Reset clearing flag after a short delay to ensure all effects have run
    setTimeout(() => {
        isClearingRef.current = false;
      }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidSearchTerm(searchTerm) && searchTerm !== lastSearchedTerm) {
      setLastSearchedTerm(searchTerm);
      searchUser(searchTerm);
      setIsTyping(false);
    }
  };

  const getValidationMessage = () => {
    if (!searchTerm) return null;
    
    if (searchTerm.length < 3) {
      return 'Enter at least 3 characters';
    }
    
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(searchTerm)) {
      return 'Invalid GitHub username format';
    }
    
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: validationMessage ? 'error.main' : 'divider',
          transition: 'all 0.2s ease',
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter GitHub username (min 3 characters)..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          onKeyPress={handleKeyPress}
          inputProps={{ 'aria-label': 'search github username' }}
        />
        
        {(state.loading || isTyping) && (
          <CircularProgress size={20} sx={{ mx: 1 }} />
        )}
        
        {searchTerm && (
          <IconButton onClick={handleClear}>
            <Clear />
          </IconButton>
        )}
      </Paper>

      {/* Validation message */}
      {validationMessage && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ mt: 1, display: 'block' }}
        >
          {validationMessage}
        </Typography>
      )}

      {/* Search tips */}
      {!searchTerm && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 1, display: 'block' }}
        >
          💡 Tip: Start typing with at least 3 characters. Search will auto-trigger after 500ms.
        </Typography>
      )}

      {/* Search history */}
      {showHistory && state.searchHistory.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            p: 2,
            zIndex: 1000,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.95)
                : theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <History sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="subtitle2">Recent Searches</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {state.searchHistory.map((username) => (
              <Chip
                key={username}
                label={username}
                onClick={() => handleSearch(username)}
                variant={username === lastSearchedTerm ? "filled" : "outlined"}
                size="small"
                color={username === lastSearchedTerm ? "primary" : "default"}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;