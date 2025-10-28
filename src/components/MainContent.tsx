import React from 'react';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useApp } from '../context/AppContext';
import UserProfile from './UserProfile';
import Repositories from './Repositories';
import UserNotFound from './UserNotFound';
import LoadingSpinner from './LoadingSpinner';

const MainContent: React.FC = () => {
  const { state, clearData } = useApp();

  if (state.loading) {
    return <LoadingSpinner />;
  }

  // Show user not found state - now it's much simpler to detect
  const isNotFoundError = state.error && state.error.includes('not found');

  if (isNotFoundError) {
    // Extract username from error message like "User 'octocat' not found"
    const username = state.error?.replace('User "', '').replace('" not found', '');
    return <UserNotFound username={username??''} onClear={clearData} />;
  }

  // Show other errors in a nice alert (not snackbar)
  if (state.error && !state.userData) {
    return (
      <Alert 
        severity="error" 
        sx={{ mt: 2, mb: 4 }}
        variant="outlined"
      >
        <Typography variant="body1" fontWeight="bold">
          Search Error
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {state.error}
        </Typography>
      </Alert>
    );
  }

  // Show no user data state (initial state or after clear)
  if (!state.userData) {
    return (
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ opacity: 0.7 }}
        >
          👆 Search for a GitHub user above to get started!
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mt: 2, opacity: 0.6 }}
        >
          Try searching for users like "octocat", "torvalds", or "gaearon"
        </Typography>
      </Box>
    );
  }

  // Show user profile and repositories
  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <UserProfile user={state.userData} />
      </Box>

      {state.repos.length > 0 ? (
        <Box>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Public Repositories ({state.repos.length})
          </Typography>
          <Repositories repos={state.repos} />
        </Box>
      ) : (
        <Alert 
          severity="info" 
          sx={{ mt: 2 }}
          variant="outlined"
        >
          This user doesn't have any public repositories.
        </Alert>
      )}
    </Box>
  );
};

export default MainContent;