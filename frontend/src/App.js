import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Container, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import HistoryIcon from '@mui/icons-material/History';
import ResumeUploader from './pages/ResumeUploader';
import HistoryViewer from './pages/HistoryViewer';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(location.pathname === '/history' ? 1 : 0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(newValue === 0 ? '/' : '/history');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Resume Analyzer
          </Typography>
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          sx={{
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.grey[800],
          }}
        >
          <Tab icon={<UploadIcon />} label="Analyze Resume" iconPosition="start" />
          <Tab icon={<HistoryIcon />} label="View History" iconPosition="start" />
        </Tabs>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/" element={<ResumeUploader />} />
          <Route path="/history" element={<HistoryViewer />} />
        </Routes>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Resume Analyzer
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
