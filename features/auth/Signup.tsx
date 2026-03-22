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
  styled,
  alpha
} from '@mui/material';
import { 
  Lock, 
  Person as User, 
  Email,
  Phone,
  Cake,
  Badge,
  School as GraduationCap, 
  MenuBook as BookOpen,
  ArrowBack
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
  },
}));

interface SignupProps {
  onBackToLogin: () => void;
  onSignupSuccess: () => void;
}

const ROLES = [
  { id: 'student', label: 'Student', icon: BookOpen, endpoint: '/v1/student/signup' },
  { id: 'educator', label: 'Educator', icon: GraduationCap, endpoint: '/v1/educator/signup' },
];

export default function Signup({ onBackToLogin, onSignupSuccess }: SignupProps) {
  const [role, setRole] = useState(ROLES[0]);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year} 00:00:00`;
      };

      const response = await fetch(`https://noncontroversial-endemically-kareen.ngrok-free.dev${role.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          birthday: formatDate(formData.birthday),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Signup failed. Please check your information.');
      }

      setSuccess(true);
      setTimeout(() => {
        onSignupSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#09090b', p: 2 }}>
        <Fade in timeout={800}>
          <StyledPaper elevation={0} sx={{ textAlign: 'center', maxWidth: 440, width: '100%' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#4ade80' }}>Success!</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Your account has been created successfully. Redirecting to login...
            </Typography>
            <CircularProgress size={40} sx={{ color: '#4ade80' }} />
          </StyledPaper>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#09090b', p: 2, py: 8 }}>
      <Fade in timeout={800}>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <StyledPaper elevation={0}>
            <IconButton 
              onClick={onBackToLogin}
              sx={{ position: 'absolute', top: 20, left: 20, color: '#71717a', '&:hover': { color: '#ffffff' } }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.03em' }}>
                Join Flash UI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your account to start generating
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
                      onClick={() => setRole(r)}
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Hao Trinh"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge sx={{ color: '#52525b', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Username
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User sx={{ color: '#52525b', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Birthday
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Cake sx={{ color: '#52525b', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hao@example.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#52525b', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Phone
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: '#52525b', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#71717a', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#52525b', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

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

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#000000',
                    py: 1.8,
                    mt: 1,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#e4e4e7' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#71717a' }}>
                    Already have an account?{' '}
                    <Button 
                      onClick={onBackToLogin}
                      sx={{ color: '#ffffff', p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    >
                      Sign In
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </form>
          </StyledPaper>
        </Box>
      </Fade>
    </Box>
  );
}
