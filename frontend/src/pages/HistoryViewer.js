import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import AnalysisResult from '../components/AnalysisResult';
import resumeService from '../services/api';

const HistoryViewer = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedResume, setSelectedResume] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getAllResumes();
      console.log('API Response:', response); // Debug log
      if (response.success) {
        setResumes(response.data || []);
      } else {
        setResumes([]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resume history. Please try again later.');
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewResume = resume => {
    setSelectedResume(resume);
    setOpenDialog(true);
  };

  const handleDeleteResume = async id => {
    if (window.confirm('Are you sure you want to delete this resume analysis?')) {
      try {
        await resumeService.deleteResume(id);
        fetchResumes(); // Refresh the list
      } catch (err) {
        console.error('Error deleting resume:', err);
        setError('Failed to delete resume. Please try again.');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResume(null);
  };

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && resumes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchResumes} variant="outlined" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Paper>
    );
  }

  if (resumes.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        <HistoryIcon color="disabled" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Resume History Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload a resume to see it appear in your history.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} />
          Resume History
        </Typography>
        <Typography variant="body1" paragraph>
          View and manage your previously analyzed resumes.
        </Typography>
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: 'info.light',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'info.main',
          }}
        >
          <Typography variant="body2" color="info.dark">
            💡 <strong>Tip:</strong> Click "View Details" to see comprehensive analysis including
            Key Highlights, Experience, Education, Skills, Projects, Certifications, AI-powered
            upskill suggestions, and detailed improvement recommendations.
          </Typography>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resumes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(resume => (
                <TableRow key={resume.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{resume.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {resume.file_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{resume.email || 'N/A'}</Typography>
                    {resume.phone && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        📞 {resume.phone}
                      </Typography>
                    )}
                    {resume.linkedin_url && (
                      <Typography variant="caption" color="primary" display="block">
                        🔗 LinkedIn
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {resume.resume_rating ? (
                      <Chip
                        label={`${resume.resume_rating}/10`}
                        color={
                          resume.resume_rating >= 7
                            ? 'success'
                            : resume.resume_rating >= 4
                              ? 'warning'
                              : 'error'
                        }
                        variant="outlined"
                      />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {resume.uploaded_at ? formatDate(resume.uploaded_at) : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="View Comprehensive Analysis - Key Highlights, Experience, Education, Skills, Projects, Certifications, AI Suggestions & Improvement Areas">
                        <Button
                          size="small"
                          onClick={() => handleViewResume(resume)}
                          color="primary"
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          View Details
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Resume">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteResume(resume.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={resumes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Resume Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth scroll="paper">
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" component="div">
                📄 Resume Analysis Details
              </Typography>
              {selectedResume && (
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  {selectedResume.name} • {selectedResume.email} • Rating:{' '}
                  {selectedResume.resume_rating}/10
                </Typography>
              )}
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedResume && (
            <Box sx={{ p: 2 }}>
              <AnalysisResult data={selectedResume} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'grey.50' }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            startIcon={<CloseIcon />}
          >
            Close Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HistoryViewer;
