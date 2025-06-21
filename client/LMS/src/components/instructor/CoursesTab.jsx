import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  CardMedia,
  useTheme
} from "@mui/material";
import { Add as AddIcon, People as PeopleIcon, MoreVert as MoreIcon, Visibility as VisibilityIcon } from "@mui/icons-material";

const CoursesTab = ({ courses: propCourses, loading: propLoading, error: propError, onRefresh, handleDialogOpen, handleMenuClick, handleCourseClick, handleViewStudents }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (propCourses) {
      setCourses(propCourses);
      setLoading(propLoading || false);
      setError(propError || null);
    }
  }, [propCourses, propLoading, propError]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={onRefresh || (() => window.location.reload())} sx={{ ml: 2 }}>Retry</Button>
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">My Courses ({courses.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen && handleDialogOpen("create")}
          sx={{ borderRadius: theme.shape.borderRadius }}
        >
          Create Course
        </Button>
      </Box>

      {courses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first course to get started
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: 300,
                  height: 450,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6]
                  },
                  cursor: 'pointer'
                }}
                onClick={() => handleCourseClick && handleCourseClick(course)}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 160,
                    objectFit: 'cover',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12
                  }}
                  image={course.thumbnail_url || '/api/placeholder/300/200'}
                  alt={course.title}
                />

                <CardContent sx={{
                  p: 3,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={course.is_published ? 'Published' : 'Draft'}
                      color={course.is_published ? "success" : "default"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    {!course.is_approved && (
                      <Chip
                        label="Pending"
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={1}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '64px'
                    }}
                  >
                    {course.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PeopleIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.enrolled_count || 0} students
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewStudents && handleViewStudents(course);
                      }}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9375rem'
                      }}
                    >
                      View Students
                    </Button>
                  </Box>
                </CardContent>

                <CardActions sx={{
                  justifyContent: "flex-end",
                  px: 2,
                  pb: 2,
                  pt: 0
                }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick && handleMenuClick(e, course);
                    }}
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid> 
          ))}
        </Grid>
      )}
    </>
  );
};

export default CoursesTab;
