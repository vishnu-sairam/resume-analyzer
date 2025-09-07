import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
  Rating,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LinkedIn,
  Language,
  Work,
  School,
  Code,
  Build,
  Star,
  Lightbulb,
  Assignment,
  Folder,
  Verified,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';

const AnalysisResult = ({ data }) => {
  const renderSection = (title, icon, content) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {React.cloneElement(icon, { color: 'primary', sx: { mr: 2, fontSize: '1.5rem' } })}
        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3, borderWidth: 2 }} />
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
        {content}
      </Paper>
    </Box>
  );

  const renderRating = rating => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 500 }}>
        Overall Rating
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Rating
          name="read-only"
          value={rating}
          precision={0.5}
          readOnly
          size="large"
          sx={{
            '& .MuiRating-iconFilled': {
              color: '#ffc107',
            },
          }}
        />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
        {rating}/10
      </Typography>
    </Box>
  );

  const renderExperience = experience => (
    <Box sx={{ mb: 3 }}>
      {experience.map((exp, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
            >
              {exp.jobTitle || exp.role || exp.degree || 'Position'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
              {exp.company || exp.institution || 'Organization'}
              {(exp.startDate || exp.endDate) && (
                <span>
                  {' '}
                  • {exp.startDate || ''} - {exp.endDate || 'Present'}
                </span>
              )}
            </Typography>
            {(exp.responsibilities || exp.description || exp.achievements) && (
              <List dense>
                {(exp.responsibilities || exp.description || exp.achievements || []).map(
                  (item, i) => (
                    <ListItem key={i} sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>•</ListItemIcon>
                      <ListItemText
                        primary={item}
                        sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          color: 'primary.main',
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        <Assignment color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
        Resume Analysis Results
      </Typography>

      {/* Key Highlights Summary */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Star sx={{ mr: 1 }} />
          Key Highlights
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                {data.resume_rating ? `${data.resume_rating}/10` : 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Overall Rating
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {Array.isArray(data.work_experience) ? data.work_experience.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Work Experiences
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                {Array.isArray(data.technical_skills) ? data.technical_skills.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Technical Skills
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                {Array.isArray(data.projects) ? data.projects.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Projects
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Statistics Row */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                {Array.isArray(data.education) ? data.education.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Education
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                {Array.isArray(data.certifications) ? data.certifications.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Certifications
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00BCD4' }}>
                {Array.isArray(data.soft_skills) ? data.soft_skills.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Soft Skills
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8BC34A' }}>
                {Array.isArray(data.upskill_suggestions) ? data.upskill_suggestions.length : 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI Suggestions
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {data.name && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
              >
                <Person sx={{ mr: 1, color: 'white' }} />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.3)' }} />
              <Box sx={{ '& > :not(style)': { mb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 2, color: 'rgba(255,255,255,0.8)' }} />
                  <Typography sx={{ fontWeight: 500 }}>{data.name}</Typography>
                </Box>
                {data.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 2, color: 'rgba(255,255,255,0.8)' }} />
                    <Typography>{data.email}</Typography>
                  </Box>
                )}
                {data.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 2, color: 'rgba(255,255,255,0.8)' }} />
                    <Typography>{data.phone}</Typography>
                  </Box>
                )}
                {data.linkedin_url && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinkedIn sx={{ mr: 2, color: 'rgba(255,255,255,0.8)' }} />
                    <Typography>{data.linkedin_url}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
              >
                <Star sx={{ mr: 1, color: 'white' }} />
                Resume Rating
              </Typography>
              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.3)' }} />
              {renderRating(data.resume_rating || 0)}

              {data.improvement_areas && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                  >
                    <Lightbulb sx={{ mr: 1, color: 'rgba(255,255,255,0.8)' }} />
                    Areas for Improvement
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {data.improvement_areas}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {data.summary &&
        renderSection(
          'Professional Summary',
          <Language />,
          <Typography variant="body1" paragraph>
            {data.summary}
          </Typography>
        )}

      {data.work_experience?.length > 0 &&
        renderSection('Work Experience', <Work />, renderExperience(data.work_experience))}

      {data.education?.length > 0 &&
        renderSection('Education', <School />, renderExperience(data.education))}

      <Grid container spacing={3}>
        {data.technical_skills?.length > 0 && (
          <Grid item xs={12} md={6}>
            {renderSection(
              'Technical Skills',
              <Code />,
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {data.technical_skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="filled"
                    color="primary"
                    sx={{
                      fontWeight: 500,
                      '&:hover': { transform: 'scale(1.05)' },
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        )}

        {data.soft_skills?.length > 0 && (
          <Grid item xs={12} md={6}>
            {renderSection(
              'Soft Skills',
              <Build />,
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {data.soft_skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="filled"
                    color="secondary"
                    sx={{
                      fontWeight: 500,
                      '&:hover': { transform: 'scale(1.05)' },
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        )}
      </Grid>

      {data.projects?.length > 0 &&
        renderSection(
          'Projects',
          <Folder />,
          <Grid container spacing={2}>
            {data.projects.map((project, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: 2,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                      {project.name || project.title || `Project ${index + 1}`}
                    </Typography>
                    {project.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.description}
                      </Typography>
                    )}
                    {project.technologies && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {project.technologies.map((tech, techIndex) => (
                          <Chip
                            key={techIndex}
                            label={tech}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    )}
                    {project.url && (
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        🔗{' '}
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          View Project
                        </a>
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

      {data.certifications?.length > 0 &&
        renderSection(
          'Certifications',
          <Verified />,
          <List>
            {data.certifications.map((cert, index) => (
              <ListItem key={index} sx={{ py: 2, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40, color: 'success.main' }}>
                  <Verified />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {cert.name || cert.title || cert}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {cert.issuer && (
                        <Typography variant="body2" color="text.secondary">
                          Issued by: {cert.issuer}
                        </Typography>
                      )}
                      {cert.date && (
                        <Typography variant="body2" color="text.secondary">
                          Date: {cert.date}
                        </Typography>
                      )}
                      {cert.credentialId && (
                        <Typography variant="body2" color="text.secondary">
                          Credential ID: {cert.credentialId}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

      {data.upskill_suggestions?.length > 0 &&
        renderSection(
          'AI-Powered Upskill Suggestions',
          <TrendingUp />,
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontStyle: 'italic' }}
            >
              Based on AI analysis of your resume, here are personalized recommendations to enhance
              your profile:
            </Typography>
            <List dense>
              {data.upskill_suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ py: 1.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32, color: 'warning.main' }}>🚀</ListItemIcon>
                  <ListItemText
                    primary={suggestion}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        lineHeight: 1.6,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

      {data.improvement_areas &&
        renderSection(
          'AI Analysis & Improvement Areas',
          <Psychology />,
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontStyle: 'italic' }}
            >
              AI-powered analysis of your resume with specific recommendations:
            </Typography>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                backgroundColor: 'warning.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'warning.main',
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                {data.improvement_areas}
              </Typography>
            </Paper>
          </Box>
        )}
    </Box>
  );
};

export default AnalysisResult;
