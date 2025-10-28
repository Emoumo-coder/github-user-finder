import React from 'react';
import {
  Box,
  Typography,
  Paper,
  alpha,
} from '@mui/material';
import {
  SearchOff,
  SentimentDissatisfied,
} from '@mui/icons-material';

interface UserNotFoundProps {
  username: string;
  onClear: () => void;
}

const UserNotFound: React.FC<UserNotFoundProps> = ({ username, onClear }) => {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : alpha(theme.palette.background.paper, 0.8),
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto',
        my: 4,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <SearchOff 
          sx={{ 
            fontSize: 64, 
            color: 'text.secondary',
            mb: 2 
          }} 
        />
        <SentimentDissatisfied 
          sx={{ 
            fontSize: 48, 
            color: 'text.secondary',
            opacity: 0.7
          }} 
        />
      </Box>

      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          background: (theme) =>
            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        User Not Found
      </Typography>

      <Typography 
        variant="h6" 
        color="text.secondary" 
        gutterBottom
        sx={{ mb: 2 }}
      >
        We couldn't find <strong>"{username}"</strong> on GitHub
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
      >
        The username you searched for doesn't exist or may have been typed incorrectly. 
        Please check the spelling and try again.
      </Typography>

      <Box 
        component="ul" 
        sx={{ 
          textAlign: 'left', 
          maxWidth: 400, 
          mx: 'auto', 
          mb: 3,
          pl: 2 
        }}
      >
        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Check for typos in the username
        </Typography>
        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Make sure the user hasn't changed their username
        </Typography>
        <Typography component="li" variant="body2" color="text.secondary">
          Try searching for a different user
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserNotFound;