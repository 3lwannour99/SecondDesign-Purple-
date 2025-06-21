import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../../components/admin/StatCard";
import UserManagement from "../../components/admin/UserManagement";
import CourseApprovals from "../../components/admin/CourseApprovals";
import SystemHealth from "../../components/admin/SystemHealth";
import AnalyticsTab from "../../components/admin/AnalyticsTab";
import SystemReports from "../../components/admin/SystemReports";
import { FiUsers, FiBookOpen, FiUserCheck, FiActivity } from "react-icons/fi";
import { getUserStats } from "../../services/userService";
import { getCourseStats, getPendingCourses } from "../../services/courseService";

const ModernPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

const ModernTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: "4px",
    borderRadius: "2px",
  },
}));

const ModernTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  minWidth: "unset",
  padding: theme.spacing(1, 2),
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    userStats: null,
    courseStats: null,
    pendingCoursesCount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        const [userStatsResponse, courseStatsResponse, pendingCoursesResponse] =
          await Promise.all([
            getUserStats(),
            getCourseStats(),
            getPendingCourses({ limit: 100 }),
          ]);

        setStats({
          userStats: userStatsResponse,
          courseStats: courseStatsResponse,
          pendingCoursesCount: pendingCoursesResponse.data.pagination.total,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard statistics",
        }));
      }
    };

    fetchStats();
  }, []);

  const admin = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: user?.avatar_url || "/api/placeholder/40/40",
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Modern Header Section */}
      <Box mb={4}>
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          mb={4}
          sx={{
            p: 3,
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: "white",
            boxShadow: theme.shadows[2],
          }}
        >
          <Avatar
            src={admin.avatar ? `${admin.avatar}?t=${Date.now()}` : admin.avatar}
            sx={{
              width: 72,
              height: 72,
              fontSize: "1.75rem",
              bgcolor: "primary.dark",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          >
            {admin.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {admin.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Here's what's happening with your platform today
            </Typography>
          </Box>
        </Box>

        {/* Modern Stats Cards */}
        {stats.loading ? (
          <Grid container spacing={isMobile ? 2 : 3} mb={4}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <ModernPaper sx={{ p: 2, textAlign: "center" }}>
                  <Box
                    sx={{
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                </ModernPaper>
              </Grid>
            ))}
          </Grid>
        ) : stats.error ? (
          <Alert severity="error" sx={{ mb: 4, borderRadius: "12px" }}>
            {stats.error}
          </Alert>
        ) : (
          <Grid container spacing={isMobile ? 2 : 3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats.userStats?.totalUsers || 0}
                icon={FiUsers}
                color="primary"
                variant="gradient"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Courses"
                value={stats.pendingCoursesCount}
                icon={FiBookOpen}
                color="warning"
                variant="gradient"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Instructors"
                value={stats.userStats?.instructors || 0}
                icon={FiUserCheck}
                color="success"
                variant="gradient"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Courses"
                value={stats.courseStats?.totalCourses || 0}
                icon={FiActivity}
                color="info"
                variant="gradient"
              />
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Modern Tabs Section */}
      <ModernPaper sx={{ mb: 4 }}>
        <ModernTabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <ModernTab value="overview" label="Overview" />
          <ModernTab value="users" label="User Management" />
          <ModernTab value="courses" label="Course Approvals" />
          <ModernTab value="analytics" label="Analytics" />
          <ModernTab value="system" label="System Health" />
          <ModernTab value="reports" label="Reports" />
        </ModernTabs>
      </ModernPaper>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {activeTab === "overview" && (
          <ModernPaper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" mb={3}>
              Platform Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                    gutterBottom
                  >
                    {stats.userStats?.students || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                    gutterBottom
                  >
                    {stats.userStats?.activeUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="secondary.main"
                    gutterBottom
                  >
                    {stats.courseStats?.publishedCourses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published Courses
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.main"
                    gutterBottom
                  >
                    {stats.userStats?.recentLogins || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Logins
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ModernPaper>
        )}
        {activeTab === "users" && (
          <ModernPaper sx={{ p: 3 }}>
            <UserManagement />
          </ModernPaper>
        )}
        {activeTab === "courses" && (
          <ModernPaper sx={{ p: 3 }}>
            <CourseApprovals />
          </ModernPaper>
        )}
        {activeTab === "analytics" && (
          <ModernPaper sx={{ p: 3 }}>
            <AnalyticsTab />
          </ModernPaper>
        )}
        {activeTab === "system" && (
          <ModernPaper sx={{ p: 3 }}>
            <SystemHealth />
          </ModernPaper>
        )}
        {activeTab === "reports" && (
          <ModernPaper sx={{ p: 3 }}>
            <SystemReports />
          </ModernPaper>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;