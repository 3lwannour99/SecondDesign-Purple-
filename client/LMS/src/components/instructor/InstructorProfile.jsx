import React from "react";
import { Box, Typography, Avatar, useTheme, useMediaQuery } from "@mui/material";

const InstructorProfile = ({ instructor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      mb={4} 
      display="flex" 
      flexDirection={isMobile ? "column" : "row"}
      alignItems={isMobile ? "flex-start" : "center"} 
      gap={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        boxShadow: theme.shadows[3],
      }}
    >
      <Avatar
        sx={{ 
          width: isMobile ? 80 : 100, 
          height: isMobile ? 80 : 100, 
          fontSize: isMobile ? "2rem" : "2.5rem", 
          bgcolor: "primary.dark",
          border: '3px solid white'
        }}
        src={instructor?.avatar ? `${instructor.avatar}?t=${Date.now()}` : instructor?.avatar}
      >
        {instructor?.name
          ? instructor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "I"}
      </Avatar>
      <Box sx={{ overflow: 'hidden' }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          fontWeight="bold" 
          mb={1}
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {instructor?.name || "Instructor Name"}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ opacity: 0.9, textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {instructor?.email || "instructor@example.com"}
        </Typography>
      </Box>
    </Box>
  );
};

export default InstructorProfile;