import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  alpha,
} from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Searching GitHub..." 
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        my: 8,
        p: 4,
      }}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          mb: 3,
          color: 'primary.main'
        }} 
      />
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ 
          textAlign: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : 'transparent',
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;