import React from 'react';
import {
  Snackbar,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { useApp } from '../context/AppContext';

const ErrorHandler: React.FC = () => {
  const { state, clearError } = useApp();
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  // Don't show snackbar for "not found" errors or when there's no error
  const isNotFoundError = state.error && (
    state.error.includes('not found') || 
    state.error.includes('Not Found') ||
    state.error.includes('404')
  );

  if (!state.error || isNotFoundError) {
    return null;
  }

  // Only show snackbar for rate limits and other API errors (not user errors)
  const shouldShowSnackbar = state.error.includes('rate limit') || 
                            state.error.includes('API') ||
                            state.error.includes('network');

  if (!shouldShowSnackbar) {
    return null;
  }

  return (
    <Snackbar
      open={!!state.error}
      autoHideDuration={8000}
      onClose={clearError}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={clearError} 
        severity="error" 
        variant="filled"
        sx={{ maxWidth: 400 }}
      >
        <Typography variant="body2" fontWeight="bold">
          {state.error.includes('rate limit') ? 'API Rate Limit Exceeded' : 'API Error'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {state.error}
        </Typography>
        {state.error.includes('rate limit') && !GITHUB_TOKEN && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ display: 'block' }}>
              💡 <strong>Solution:</strong> Add a GitHub Personal Access Token
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', opacity: 0.9 }}>
              1. Create token at: GitHub Settings → Developer settings → Personal access tokens
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', opacity: 0.9 }}>
              2. Add to .env: VITE_GITHUB_TOKEN=your_token_here
            </Typography>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default ErrorHandler;