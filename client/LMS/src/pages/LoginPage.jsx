import loginImage from "../assets/login.png";
import React, { useState } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Divider,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  IconButton
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, googleLogin, loading, errors } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      if (result && result.user) {
        const dashboardMap = {
          'student': '/dashboard/student',
          'instructor': '/dashboard/instructor',
          'admin': '/dashboard/admin'
        };
        navigate(dashboardMap[result.user.role] || '/dashboard/student');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
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
      <Grid 
        container 
        sx={{ 
          maxWidth: { xs: '95%', md: '90%', lg: '1200px' },
          minHeight: { xs: 'auto', md: '85vh' },
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backgroundColor: 'background.paper'
        }}
      >
        {/* Image Section */}
        <Grid 
          item 
          xs={12} 
          md={6}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <Box
            component="img"
            src={loginImage}
            alt="Login illustration"
            sx={{ 
              width: '90%',
              maxWidth: '500px',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
            }}
          />
        </Grid>
        
        {/* Form Section */}
        <Grid 
          item 
          xs={12} 
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, sm: 6, md: 8 }
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 450
            }}
          >
            {/* Back Button */}
            <IconButton
              onClick={handleBackToHome}
              sx={{
                position: 'absolute',
                top: { xs: 24, sm: 32 },
                left: { xs: 24, sm: 32 },
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h4"
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
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Sign in to access your personalized dashboard
            </Typography>

            {errors.login && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.login}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  mb: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  borderRadius: 1,
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'text.secondary'
                  }
                }}
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Continue with Google'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or sign in with email
                </Typography>
              </Divider>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                size="medium"
                sx={{ mb: 2 }}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
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
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                size="medium"
                sx={{ mb: 1 }}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
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

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mb: 3
                }}
              >
                <Link 
                  href="#" 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main'
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 1,
                  mb: 3,
                  py: 1.5,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    opacity: 0.9
                  }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

              <Typography 
                variant="body2" 
                align="center"
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  sx={{ 
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;