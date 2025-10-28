import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  GitHub,
  LocationOn,
  Business,
  Link,
  Twitter,
  People,
  Folder,
} from '@mui/icons-material';
import type { GitHubUser } from '../types';

interface UserProfileProps {
  user: GitHubUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={user.avatar_url}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid',
                borderColor: 'primary.main',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            />
            <IconButton
              href={user.html_url}
              target="_blank"
              sx={{ mt: 2 }}
              color="primary"
            >
              <GitHub />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {user.name || user.login}
            </Typography>
            
            {user.login && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                @{user.login}
              </Typography>
            )}

            {user.bio && (
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {user.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Chip
                icon={<People />}
                label={`${user.followers} followers`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<People />}
                label={`${user.following} following`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Folder />}
                label={`${user.public_repos} repos`}
                variant="outlined"
                size="small"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {user.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="body2">{user.location}</Typography>
                </Box>
              )}
              
              {user.company && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="action" />
                  <Typography variant="body2">{user.company}</Typography>
                </Box>
              )}
              
              {user.blog && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Link color="action" />
                  <Typography
                    variant="body2"
                    component="a"
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {user.blog}
                  </Typography>
                </Box>
              )}
              
              {user.twitter_username && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Twitter color="action" />
                  <Typography
                    variant="body2"
                    component="a"
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    @{user.twitter_username}
                  </Typography>
                </Box>
              )}
            </Box>

            {user.created_at && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Joined {formatDate(user.created_at)}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfile;