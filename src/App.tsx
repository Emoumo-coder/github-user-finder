import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  GitHub,
} from '@mui/icons-material';
import { useApp } from './context/AppContext';
import { lightTheme, darkTheme } from './theme/theme';
import SearchBar from './components/SearchBar';
import MainContent from './components/MainContent';
import ErrorHandler from './components/ErrorHandler';

const App: React.FC = () => {
  const { toggleTheme, isDarkMode } = useApp();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <GitHub sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            GitHub User Finder
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SearchBar />
        <MainContent />
      </Container>

      {/* Global Error Handler */}
      <ErrorHandler />

      {/* Scroll to Top FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </Fab>
    </ThemeProvider>
  );
};

export default App;