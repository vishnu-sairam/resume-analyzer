import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import AnalysisResult from '../components/AnalysisResult';
import resumeService from '../services/api';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a valid PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsLoading(true);
    setError('');

    try {
      const response = await resumeService.uploadResume(formData);
      console.log('Upload response:', response); // Debug log
      if (response.success) {
        // Transform the nested structure to flat structure for AnalysisResult component
        const transformedData = {
          id: response.data.id,
          name: response.data.personalInfo?.name || '',
          email: response.data.personalInfo?.email || '',
          phone: response.data.personalInfo?.phone || '',
          linkedin_url: response.data.personalInfo?.linkedin || '',
          portfolio_url: response.data.personalInfo?.portfolio || '',
          summary: response.data.summary || '',
          work_experience: response.data.workExperience || [],
          education: response.data.education || [],
          technical_skills: response.data.skills?.technical || [],
          soft_skills: response.data.skills?.soft || [],
          projects: response.data.projects || [],
          certifications: response.data.certifications || [],
          resume_rating: response.data.analysis?.rating || 0,
          improvement_areas: response.data.analysis?.improvementAreas || [],
          upskill_suggestions: response.data.analysis?.recommendations || [],
        };
        setAnalysisResult(transformedData);
      } else {
        setError(response.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upload Your Resume
        </Typography>
        <Typography variant="body1" paragraph>
          Upload a PDF version of your resume to receive AI-powered analysis and improvement
          suggestions.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3, alignItems: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ width: 'fit-content' }}
          >
            Choose File
            <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected: {file.name}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>

      {analysisResult && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <AnalysisResult data={analysisResult} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ResumeUploader;
