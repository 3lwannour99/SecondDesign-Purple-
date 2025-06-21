import signupImage from '../assets/signup.png';
import React, { useState } from 'react';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { register, loading, errors } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result && result.user) {
        const dashboardMap = {
          'student': '/dashboard/student',
          'instructor': '/dashboard/instructor',
          'admin': '/dashboard/admin'
        };
        navigate(dashboardMap[result.user.role] || '/dashboard/student');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '90%',
          maxWidth: '1200px',
          minHeight: '600px',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backgroundColor: 'background.paper'
        }}
      >
        {/* Image Section */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <Box
            component="img"
            src={signupImage}
            alt="Sign up illustration"
            sx={{ 
              width: '100%',
              height: 'auto',
              maxWidth: '500px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
            }}
          />
        </Box>
        
        {/* Form Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, sm: 6 },
            position: 'relative'
          }}
        >
          <IconButton
            onClick={handleBackToHome}
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ width: '100%', maxWidth: '450px' }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                mb: 3,
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                textAlign: 'center'
              }}
            >
              Create Account
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Join our community today
            </Typography>

            {(localError || errors.register) && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {localError || errors.register}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 3 }}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: 'divider'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 3 }}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: 'divider'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password (min 6 characters)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: 'divider'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ mb: 4 }}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: 'divider'
                    }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>

              <Divider sx={{ my: 3 }}>or</Divider>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    fontWeight: 500,
                    color: 'text.secondary'
                  }}
                >
                  Already have an account?{' '}
                  <Link 
                    component="button"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: 'primary.main',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;