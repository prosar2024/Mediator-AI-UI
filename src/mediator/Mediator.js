import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Paper,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NewCaseIcon from '@mui/icons-material/PersonAdd';
import NewCase from './NewCase';

const navigationItems = [
  { name: 'New Case', icon: <NewCaseIcon /> },
  { name: 'On Going', icon: <HomeIcon /> },
  { name: 'History', icon: <HistoryIcon /> },
  { name: 'Account', icon: <AccountCircleIcon /> },
];

function Mediator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  
  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  return (
    <Container maxWidth={false} disableGutters sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', height: '100%' }}>
        <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
          <Toolbar>
            <Box borderRadius={10} component="img" src={"https://mui.com/static/images/avatar/7.jpg"} alt="logo" sx={{ height: 40, marginRight: 2 }} />
            <Typography variant="h6" noWrap>
              Mediator AI
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleToggleSidebar} sx={{ marginLeft: '20px' }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar src="https://mui.com/static/images/avatar/2.jpg" />
            {!isMobile && (
              <Typography variant="subtitle1" noWrap sx={{ marginLeft: '10px' }}>
                Aravind R Pillai
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
          {showSidebar && (
            <Box sx={{ width: '300px', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
              <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {navigationItems.map((item) => (
                  <ListItem
                    button
                    key={item.name}
                    sx={{
                      padding: '10px',
                      '&:hover': {
                        backgroundColor: '#f1f1f1',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                ))}
              </List>
              <Divider />
            </Box>
          )}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ flexGrow: 1, padding: '10px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
              <NewCase />
            </Paper>
          </Box>
        </Box>
        <Box sx={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #ddd' }}>
          <Typography variant="caption">&copy; 2024 Mediator AI Application. All rights reserved.</Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Mediator;
