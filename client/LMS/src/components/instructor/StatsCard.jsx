import React from "react";
import { Card, CardContent, Box, Typography, Avatar, useTheme } from "@mui/material";

const StatCard = ({ title, value, icon: IconComponent, color = "primary" }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: theme.shadows[1],
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: `${color}.main`,
              width: 56, 
              height: 56,
              borderRadius: theme.shape.borderRadius * 1.5
            }}
          >
            <IconComponent fontSize="medium" />
          </Avatar>
          <Box>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              fontWeight={700}
              sx={{ 
                color: theme.palette.text.primary,
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;