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
  const [rowsPerPage, setRowsPerPage] = useState(3);
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

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Education</TableCell>
                <TableCell>Skills</TableCell>
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
                    {resume.work_experience?.length > 0 ? (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {resume.work_experience[0]?.jobTitle || resume.work_experience[0]?.role || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {resume.work_experience[0]?.company || 'N/A'}
                        </Typography>
                        {resume.work_experience.length > 1 && (
                          <Typography variant="caption" color="primary" display="block">
                            +{resume.work_experience.length - 1} more
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {resume.education?.length > 0 ? (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {resume.education[0]?.degree || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {resume.education[0]?.institution || 'N/A'}
                        </Typography>
                        {resume.education.length > 1 && (
                          <Typography variant="caption" color="primary" display="block">
                            +{resume.education.length - 1} more
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                      {resume.technical_skills?.slice(0, 3).map((skill, i) => (
                        <Chip key={i} label={skill} size="small" />
                      ))}
                      {resume.technical_skills?.length > 3 && (
                        <Chip
                          label={`+${resume.technical_skills.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
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
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewResume(resume)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteResume(resume.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[3, 5, 10]}
          component="div"
          count={resumes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Resume Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Resume Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedResume && <AnalysisResult data={selectedResume} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HistoryViewer;
