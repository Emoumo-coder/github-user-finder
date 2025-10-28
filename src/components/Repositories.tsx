import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Star,
  ForkRight,
  Code,
  OpenInNew,
} from '@mui/icons-material';
import type { GitHubRepo } from '../types';

interface RepositoriesProps {
  repos: GitHubRepo[];
}

const Repositories: React.FC<RepositoriesProps> = ({ repos }) => {
  const [visibleRepos, setVisibleRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const reposPerPage = 9;

  useEffect(() => {
    setVisibleRepos(repos.slice(0, reposPerPage));
    setPage(1);
  }, [repos]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;

      const nextPage = page + 1;
      const nextRepos = repos.slice(0, nextPage * reposPerPage);
      setVisibleRepos(nextRepos);
      setPage(nextPage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, repos]);

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (repos.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography textAlign="center" color="text.secondary">
            No repositories found
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {visibleRepos.map((repo) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={repo.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
              }}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {repo.name}
                  </Typography>
                  <IconButton
                    href={repo.html_url}
                    target="_blank"
                    size="small"
                    color="primary"
                  >
                    <OpenInNew />
                  </IconButton>
                </Box>

                {repo.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flex: 1, lineHeight: 1.5 }}
                  >
                    {repo.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {repo.language && (
                    <Chip
                      icon={<Code />}
                      label={repo.language}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    icon={<Star />}
                    label={repo.stargazers_count}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<ForkRight />}
                    label={repo.forks_count}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Updated {formatDate(repo.updated_at)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatSize(repo.size)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {visibleRepos.length < repos.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Chip
            label={`Loading more... (${visibleRepos.length} of ${repos.length})`}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default Repositories;