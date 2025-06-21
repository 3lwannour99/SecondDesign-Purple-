import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUsers';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Lock,
  Person
} from '@mui/icons-material';

const SettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const { profile, loading: profileLoading, error: profileError, updateProfile, updatePassword } = useUserProfile();
  
  // User data state
  const [user, setUser] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Update local state when profile loads
  useEffect(() => {
    if (profile) {
      setUser(prev => ({
        ...prev,
        name: profile.name || '',
        email: profile.email || ''
      }));
    } else if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name || '',
        email: authUser.email || ''
      }));
    }
  }, [profile, authUser]);

  // Edit mode and UI states
  const [editNameMode, setEditNameMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (editNameMode && !user.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (editPasswordMode) {
      if (!user.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!user.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (user.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (user.newPassword !== user.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save name changes
  const handleSaveName = async () => {
    if (!validate()) return;
    
    try {
      await updateProfile({ name: user.name }, (updatedProfile) => {
        if (setAuthUser) {
          setAuthUser(prev => ({ ...prev, name: updatedProfile.name }));
        }
      });
      setSuccessMessage('Name updated successfully');
      setEditNameMode(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ name: error.message || 'Failed to update name' });
    }
  };

  // Save password changes
  const handleSavePassword = async () => {
    if (!validate()) return;
    
    try {
      await updatePassword({
        currentPassword: user.currentPassword,
        newPassword: user.newPassword
      });
      setSuccessMessage('Password updated successfully');
      setUser(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setEditPasswordMode(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.data?.message || 
                         error.response?.data?.error || 
                         error.response?.statusText || 
                         error.message || 
                         'Failed to update password';
      setErrors({ currentPassword: errorMessage });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditNameMode(false);
    setEditPasswordMode(false);
    setErrors({});
    
    const originalName = profile?.name || authUser?.name || '';
    setUser(prev => ({ 
      ...prev, 
      name: originalName,
      currentPassword: '', 
      newPassword: '', 
      confirmPassword: '' 
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 3
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 900, // Wider card (900px instead of 600px)
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
          }
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 1
            }}
          >
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and security settings
          </Typography>
        </Box>

        {/* Alerts */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {profileError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {profileError}
          </Alert>
        )}
        
        {profileLoading && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Loading profile data...
          </Alert>
        )}

        {/* Two-column layout for wider card */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4
        }}>
          {/* Left Column - Account Information */}
          <Box>
            <Typography 
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 2,
                fontSize: '1.1rem'
              }}
            >
              Personal Information
            </Typography>

            {/* Email Field */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email Address
              </Typography>
              <TextField
                value={user.email}
                fullWidth
                disabled
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'action.hover'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Name Field */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Full Name
              </Typography>
              {editNameMode ? (
                <Box>
                  <TextField
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'divider'
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveName}
                      disabled={profileLoading}
                      sx={{
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'divider',
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Stack direction="row" spacing={2}>
                  <TextField
                    value={user.name}
                    fullWidth
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'action.hover'
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditNameMode(true)}
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Right Column - Security Settings */}
          <Box>
            <Typography 
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 2,
                fontSize: '1.1rem'
              }}
            >
              Security Settings
            </Typography>

            {/* Password Section */}
            {editPasswordMode ? (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Current Password
                  </Typography>
                  <TextField
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={user.currentPassword}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'divider'
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    New Password
                  </Typography>
                  <TextField
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={user.newPassword}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'divider'
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Confirm New Password
                  </Typography>
                  <TextField
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={user.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'divider'
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSavePassword}
                    disabled={profileLoading}
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        opacity: 0.9
                      }
                    }}
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: 'divider',
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Change your password to keep your account secure
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditPasswordMode(true)}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 200
                  }}
                >
                  Change Password
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;