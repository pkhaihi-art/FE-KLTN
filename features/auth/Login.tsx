import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  IconButton, 
  InputAdornment, 
  CircularProgress,
  Alert,
  Fade,
  styled
} from '@mui/material';
import { 
  Lock, 
  Person as User, 
  Shield, 
  School as GraduationCap, 
  MenuBook as BookOpen, 
  Business as Building2 
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  border: '1px solid #27272a',
  backgroundColor: '#18181b',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 200,
    height: 200,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
}));

const RoleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  borderRadius: 16,
  border: `1px solid ${active ? 'rgba(255, 255, 255, 0.2)' : '#27272a'}`,
  backgroundColor: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
  color: active ? '#ffffff' : '#71717a',
  gap: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: active ? 'rgba(255, 255, 255, 0.3)' : '#3f3f46',
    color: '#ffffff',
    transform: 'translateY(-2px)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 28,
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1)',
  },
}));

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onGoToSignup: () => void;
}

const ROLES = [
  { id: 'admin', label: 'Admin', icon: Shield, grantType: 'password' },
  { id: 'educator', label: 'Educator', icon: GraduationCap, grantType: 'educator' },
  { id: 'student', label: 'Student', icon: BookOpen, grantType: 'student' },
  { id: 'enterprise', label: 'Enterprise', icon: Building2, grantType: 'enterprise' },
];

export default function Login({ onLoginSuccess, onGoToSignup }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const basicAuth = btoa('abc_client:abc123');
      const response = await fetch('https://noncontroversial-endemically-kareen.ngrok-free.dev/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          grant_type: role.grantType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      onLoginSuccess(data.access_token || 'mock_token', { username, role: role.id });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    if (role.id === 'admin') {
      setUsername('admin');
      setPassword('admin123654');
    } else {
      setUsername(role.id);
      setPassword(role.id + '123');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#09090b',
        p: 2
      }}
    >
      <Fade in timeout={800}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <StyledPaper elevation={0}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.03em' }}>
                Flash UI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select your role to continue
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <Grid size={6} key={r.id}>
                    <RoleButton
                      fullWidth
                      active={role.id === r.id}
                      onClick={() => {
                        setRole(r);
                        setError(null);
                      }}
                    >
                      <Icon />
                      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {r.label}
                      </Typography>
                    </RoleButton>
                  </Grid>
                );
              })}
            </Grid>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User sx={{ color: '#52525b', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#52525b', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {error && (
                  <Alert 
                    severity="error" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 3, 
                      bgcolor: 'rgba(239, 68, 68, 0.05)',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      '& .MuiAlert-icon': { color: '#f87171' }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box sx={{ mt: 1 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#ffffff',
                      color: '#000000',
                      py: 1.8,
                      fontSize: '1rem',
                      '&:hover': {
                        bgcolor: '#e4e4e7',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                  
                  <Button
                    fullWidth
                    onClick={fillDemo}
                    sx={{ 
                      mt: 1, 
                      color: '#71717a', 
                      fontSize: '0.75rem',
                      '&:hover': { color: '#ffffff', bgcolor: 'transparent' }
                    }}
                  >
                    Use demo credentials
                  </Button>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ color: '#71717a' }}>
                    Don't have an account?{' '}
                    <Button 
                      onClick={onGoToSignup}
                      sx={{ color: '#ffffff', p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    >
                      Sign Up
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </form>

            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #27272a', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#3f3f46', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
                Enterprise Grade Security
              </Typography>
            </Box>
          </StyledPaper>
        </Box>
      </Fade>
    </Box>
  );
}
