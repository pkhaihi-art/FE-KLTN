import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  styled,
  alpha,
  Button,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as UserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  School as EducatorIcon,
  MenuBook as StudentIcon,
  Business as EnterpriseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  color: '#ffffff',
  boxShadow: 'none',
  position: 'relative',
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: alpha('#ffffff', 0.02),
  border: '1px solid #27272a',
  transition: 'all 0.2s ease',
  height: '100%',
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.05),
    borderColor: '#3f3f46',
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    backgroundColor: alpha('#ffffff', 0.03),
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#27272a',
    },
    '&:hover fieldset': {
      borderColor: '#3f3f46',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#71717a',
    '&.Mui-focused': {
      color: '#ffffff',
    },
  },
});

interface ProfileProps {
  user: {
    username: string;
    role: string;
  };
}

export default function Profile({ user }: ProfileProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editFormData, setEditFormData] = useState<any>({
    fullName: '',
    fullname: '', // for student/educator
    email: '',
    phone: '',
    birthday: '',
    username: '',
    avatarPath: '',
    oldPassword: '',
    password: '',
  });

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError('No authentication token found');
      setIsLoading(false);
      return;
    }

    let endpoint = '';
    switch (user.role) {
      case 'admin':
        endpoint = '/v1/account/profile';
        break;
      case 'student':
        endpoint = '/v1/student/profile';
        break;
      case 'educator':
        endpoint = '/v1/educator/profile';
        break;
      default:
        endpoint = '/v1/account/profile';
    }

    try {
      const response = await fetch(`https://noncontroversial-endemically-kareen.ngrok-free.dev${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const result = await response.json();
      
      if (result.result || result.data) {
        let normalizedData = null;
        if (user.role === 'student') {
          normalizedData = result.data.profileAccountDto;
        } else {
          normalizedData = result.data || result;
        }
        setProfileData(normalizedData);
        
        // Initialize edit form
        setEditFormData({
          fullName: normalizedData.fullName || '',
          fullname: normalizedData.fullName || '',
          email: normalizedData.email || '',
          phone: normalizedData.phone || '',
          birthday: normalizedData.birthday ? normalizedData.birthday.split('T')[0] : '',
          username: normalizedData.username || user.username,
          avatarPath: normalizedData.avatar || '',
          oldPassword: '',
          password: '',
        });
      } else {
        throw new Error(result.message || 'Failed to load profile');
      }
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user.role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({
      ...prev,
      [name]: value,
      // Sync fullName and fullname
      ...(name === 'fullName' ? { fullname: value } : {}),
      ...(name === 'fullname' ? { fullName: value } : {}),
    }));
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setError('No authentication token found');
      setIsUpdating(false);
      return;
    }

    let endpoint = '';
    let payload: any = {};

    // Format birthday
    const formatBirthday = (dateStr: string, role: string) => {
      if (!dateStr) return '';
      if (role === 'student') {
        return new Date(dateStr).toISOString();
      } else {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year} 00:00:00`;
      }
    };

    switch (user.role) {
      case 'admin':
        endpoint = '/v1/account/update_profile_admin';
        payload = {
          avatarPath: editFormData.avatarPath,
          birthday: formatBirthday(editFormData.birthday, 'admin'),
          email: editFormData.email,
          fullName: editFormData.fullName,
          oldPassword: editFormData.oldPassword,
          password: editFormData.password,
          phone: editFormData.phone,
        };
        break;
      case 'educator':
        endpoint = '/v1/educator/client_update';
        payload = {
          avatarPath: editFormData.avatarPath,
          birthday: formatBirthday(editFormData.birthday, 'educator'),
          fullname: editFormData.fullname,
          phone: editFormData.phone,
          username: editFormData.username,
        };
        break;
      case 'student':
        endpoint = '/v1/student/client_update';
        payload = {
          avatarPath: editFormData.avatarPath,
          birthday: formatBirthday(editFormData.birthday, 'student'),
          fullname: editFormData.fullname,
          phone: editFormData.phone,
          username: editFormData.username,
        };
        break;
      default:
        setError('Role not supported for updates');
        setIsUpdating(false);
        return;
    }

    try {
      const response = await fetch(`https://noncontroversial-endemically-kareen.ngrok-free.dev${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && (result.result || result.success)) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        await fetchProfile(); // Refresh data
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin': return <SecurityIcon />;
      case 'educator': return <EducatorIcon />;
      case 'student': return <StudentIcon />;
      case 'enterprise': return <EnterpriseIcon />;
      default: return <UserIcon />;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <ProfilePaper>
        {/* Header Actions */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
          {!isEditing ? (
            <Tooltip title="Edit Profile">
              <IconButton 
                onClick={() => setIsEditing(true)}
                sx={{ color: '#a1a1aa', '&:hover': { color: '#ffffff', bgcolor: alpha('#ffffff', 0.05) } }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Cancel">
                <IconButton 
                  onClick={() => setIsEditing(false)}
                  sx={{ color: '#f87171', '&:hover': { bgcolor: alpha('#f87171', 0.05) } }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save Changes">
                <IconButton 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  sx={{ color: '#4ade80', '&:hover': { bgcolor: alpha('#4ade80', 0.05) } }}
                >
                  {isUpdating ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box 
            sx={{ position: 'relative', cursor: 'pointer' }} 
            component="label"
            onClick={() => !isEditing && setIsEditing(true)}
          >
            <Avatar 
              src={isEditing ? editFormData.avatarPath : profileData?.avatar} 
              sx={{ 
                width: 100, 
                height: 100, 
                mb: 2, 
                bgcolor: alpha('#ffffff', 0.1),
                fontSize: '2.5rem',
                fontWeight: 800,
                border: '4px solid #27272a',
                transition: 'all 0.2s ease',
                '&:hover': {
                  opacity: 0.8,
                  borderColor: '#ffffff',
                  transform: isEditing ? 'none' : 'scale(1.05)',
                }
              }}
            >
              {(profileData?.fullName || user.username)[0].toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 0,
                bgcolor: isEditing ? '#ffffff' : alpha('#ffffff', 0.2),
                color: isEditing ? '#000000' : '#ffffff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                border: '2px solid #18181b',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
              }}
            >
              {isEditing ? <PhotoIcon sx={{ fontSize: 18 }} /> : <EditIcon sx={{ fontSize: 18 }} />}
            </Box>
            {isEditing && (
              <input 
                hidden 
                accept="image/*" 
                type="file" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditFormData((prev: any) => ({ ...prev, avatarPath: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              name={user.role === 'admin' ? 'fullName' : 'fullname'}
              label="Full Name"
              value={user.role === 'admin' ? editFormData.fullName : editFormData.fullname}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              sx={{ mt: 1, width: '100%', maxWidth: 300 }}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                {profileData?.fullName || 'User Profile'}
              </Typography>
              <Button
                variant="text"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{ 
                  color: '#ffffff', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  opacity: 0.7,
                  '&:hover': { opacity: 1, bgcolor: alpha('#ffffff', 0.05) }
                }}
              >
                Edit Profile
              </Button>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#71717a', mt: 1 }}>
            {getRoleIcon()}
            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {user.role}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" variant="outlined" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.05)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" variant="outlined" sx={{ mb: 3, bgcolor: 'rgba(74, 222, 128, 0.05)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.2)' }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ mb: 4, borderColor: '#27272a' }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem>
              <UserIcon sx={{ color: '#71717a' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  Username
                </Typography>
                {isEditing && user.role !== 'admin' ? (
                  <StyledTextField
                    fullWidth
                    name="username"
                    value={editFormData.username}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {profileData?.username || user.username}
                  </Typography>
                )}
              </Box>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem>
              <EmailIcon sx={{ color: '#71717a' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  Email Address
                </Typography>
                {isEditing && user.role === 'admin' ? (
                  <StyledTextField
                    fullWidth
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {profileData?.email || 'N/A'}
                  </Typography>
                )}
              </Box>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem>
              <PhoneIcon sx={{ color: '#71717a' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  Phone Number
                </Typography>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {profileData?.phone || 'N/A'}
                  </Typography>
                )}
              </Box>
            </InfoItem>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoItem>
              <CakeIcon sx={{ color: '#71717a' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  Birthday
                </Typography>
                {isEditing ? (
                  <StyledTextField
                    fullWidth
                    type="date"
                    name="birthday"
                    value={editFormData.birthday}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatDate(profileData?.birthday)}
                  </Typography>
                )}
              </Box>
            </InfoItem>
          </Grid>

          {isEditing && user.role === 'admin' && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem>
                  <LockIcon sx={{ color: '#71717a' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                      Old Password
                    </Typography>
                    <StyledTextField
                      fullWidth
                      type="password"
                      name="oldPassword"
                      value={editFormData.oldPassword}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </InfoItem>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem>
                  <LockIcon sx={{ color: '#71717a' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                      New Password
                    </Typography>
                    <StyledTextField
                      fullWidth
                      type="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </InfoItem>
              </Grid>
            </>
          )}

          {isEditing && (
            <Grid size={12}>
              <InfoItem>
                <PhotoIcon sx={{ color: '#71717a' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#71717a', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    Avatar URL (Optional)
                  </Typography>
                  <StyledTextField
                    fullWidth
                    name="avatarPath"
                    placeholder="https://example.com/avatar.jpg"
                    value={editFormData.avatarPath}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </InfoItem>
            </Grid>
          )}
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
              sx={{ color: '#a1a1aa', borderColor: '#27272a', borderRadius: '12px' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              sx={{ 
                bgcolor: '#ffffff', 
                color: '#000000', 
                borderRadius: '12px',
                '&:hover': { bgcolor: '#e4e4e7' }
              }}
            >
              {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>
          </Box>
        )}
      </ProfilePaper>
    </Box>
  );
}
