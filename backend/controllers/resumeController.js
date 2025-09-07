import pdf from 'pdf-parse/lib/pdf-parse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { query } from '../db/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const config = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedMimeTypes: ['application/pdf'],
  defaultModel: 'gemini-1.5-pro',
  fallbackModel: 'gemini-1.5-flash',
  analysisPrompt: `Extract and analyze the following resume information:
  
  1. Personal Information:
     - Full Name
     - Email
     - Phone Number
     - LinkedIn Profile (if available)
     - Portfolio/Website (if available)
  
  2. Professional Summary/Objective
  
  3. Work Experience (for each position):
     - Job Title
     - Company Name
     - Duration (Start Date - End Date or Present)
     - Key Responsibilities and Achievements (bulleted points)
  
  4. Education:
     - Degree
     - Institution
     - Graduation Year
     - Relevant Coursework or Achievements
  
  5. Skills:
     - Technical Skills (programming languages, tools, frameworks, etc.)
     - Soft Skills (communication, leadership, etc.)
  
  6. Projects (if any):
     - Project Name
     - Description
     - Technologies Used
     - Your Role
  
  7. Certifications (if any):
     - Certification Name
     - Issuing Organization
     - Date Obtained

Return the response in a structured JSON format with the following structure:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "portfolio": ""
  },
  "summary": "",
  "workExperience": [
    {
      "jobTitle": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "responsibilities": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "graduationYear": "",
      "achievements": []
    }
  ],
  "skills": {
    "technical": [],
    "soft": []
  },
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "role": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "dateObtained": ""
    }
  ],
  "analysis": {
    "rating": 0,
    "strengths": [],
    "improvementAreas": [],
    "skillGaps": [],
    "recommendations": []
  }
}

After extracting the resume information, provide a detailed analysis with the following:
1. Rate the resume on a scale of 1-10 based on content, structure, and relevance to tech industry standards.
2. List the top 3 strengths of the resume.
3. List 3-5 areas for improvement with specific, actionable suggestions.
4. Identify any skill gaps based on current industry trends.
5. Provide 3-5 personalized recommendations for upskilling or certification.`,
};

// Initialize Google Generative AI
const apiKey = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';
console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Extracts text content from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} Extracted and cleaned text
 */
async function extractTextFromPDF(buffer) {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty file provided');
    }

    if (buffer.length > config.maxFileSize) {
      throw new Error(
        `File size exceeds the maximum limit of ${config.maxFileSize / (1024 * 1024)}MB`
      );
    }

    const options = {
      worker: null, // Disable worker for better compatibility
      disableFontFace: true, // Improve performance
      disableAutoFetch: true, // Reduce memory usage
      max: 10, // Max number of pages to parse (prevent DoS)
    };

    const data = await pdf(buffer, options);

    if (!data?.text?.trim()) {
      throw new Error(
        'No text content found in PDF. The file may be scanned or contain only images.'
      );
    }

    // Clean up the extracted text
    const cleanedText = data.text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
      .trim();

    if (cleanedText.length < 50) {
      // Minimum reasonable length for a resume
      throw new Error('Extracted text is too short to be a valid resume');
    }

    return cleanedText;
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Analyzes text using a specific model
 * @param {string} text - The text to analyze
 * @param {string} modelName - The name of the model to use
 * @returns {Promise<Object>} The analysis result
 */
async function analyzeWithModel(text, modelName) {
  const modelType = modelName.includes('pro') ? 'pro' : 'flash';
  console.log(`🤖 Using Gemini ${modelType.toUpperCase()} model: ${modelName}`);

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `You are an expert resume analyzer. Your task is to extract and analyze the following resume information.
  
  Resume Text:
  ${text.substring(0, 30000)}
  
  ${config.analysisPrompt}
  
  Important Guidelines:
  1. Be accurate and objective in your analysis
  2. Provide specific, actionable feedback
  3. Focus on both strengths and areas for improvement
  4. Consider current industry standards and best practices
  5. Be constructive and professional in your feedback
  
  Return ONLY a valid JSON object with the structure described above. Do not include any additional text, markdown formatting, or code blocks.`;

  try {
    console.log(`Sending request to ${modelName}...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response || !response.text) {
      throw new Error('Empty response from model');
    }

    const responseText = await response.text();
    console.log('Raw model response:', responseText.substring(0, 200) + '...');

    // Clean the response to extract valid JSON
    let jsonString = responseText.trim();

    // Remove markdown code block markers if present and handle common JSON parsing issues
    jsonString = jsonString
      .replace(/^```(?:json)?\s*|\s*```$/g, '') // Remove code block markers
      .replace(/\\"/g, '"') // Fix escaped quotes
      .replace(/\\'/g, "'") // Fix escaped single quotes
      .replace(/[“”]/g, '"') // Replace smart quotes
      .replace(/[‘’]/g, "'");

    // Try to find a JSON object in the response
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from response:', jsonString.substring(0, 300));
      throw new Error('Invalid response format from model: Could not extract JSON');
    }

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (!parsedResponse.personalInfo || !parsedResponse.workExperience) {
        throw new Error('Invalid response structure from model: Missing required fields');
      }

      // Ensure required arrays exist
      parsedResponse.workExperience = parsedResponse.workExperience || [];
      parsedResponse.education = parsedResponse.education || [];
      parsedResponse.projects = parsedResponse.projects || [];
      parsedResponse.certifications = parsedResponse.certifications || [];
      parsedResponse.skills = parsedResponse.skills || {};
      parsedResponse.skills.technical = parsedResponse.skills.technical || [];
      parsedResponse.skills.soft = parsedResponse.skills.soft || [];

      // Ensure analysis object exists with all required fields
      parsedResponse.analysis = parsedResponse.analysis || {};
      parsedResponse.analysis.rating = Math.min(
        10,
        Math.max(1, parsedResponse.analysis.rating || 5)
      ); // Clamp rating 1-10
      parsedResponse.analysis.strengths = parsedResponse.analysis.strengths || [];
      parsedResponse.analysis.improvementAreas = parsedResponse.analysis.improvementAreas || [];
      parsedResponse.analysis.skillGaps = parsedResponse.analysis.skillGaps || [];
      parsedResponse.analysis.recommendations = parsedResponse.analysis.recommendations || [];

      // Ensure personal info has all required fields
      parsedResponse.personalInfo = parsedResponse.personalInfo || {};
      parsedResponse.personalInfo.name = parsedResponse.personalInfo.name || 'Not provided';
      parsedResponse.personalInfo.email = parsedResponse.personalInfo.email || 'Not provided';
      parsedResponse.personalInfo.phone = parsedResponse.personalInfo.phone || 'Not provided';
      parsedResponse.personalInfo.linkedin = parsedResponse.personalInfo.linkedin || 'Not provided';
      parsedResponse.personalInfo.portfolio =
        parsedResponse.personalInfo.portfolio || 'Not provided';

      // Ensure summary exists
      parsedResponse.summary = parsedResponse.summary || 'No summary provided';

      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error(`Failed to parse model response: ${parseError.message}`);
    }
  } catch (error) {
    console.error(`❌ Error analyzing with model ${modelName}:`, error.message);

    // Check for specific error types that should trigger fallback
    const errorMessage = error.message.toLowerCase();
    const isQuotaError =
      errorMessage.includes('quota') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests') ||
      error.status === 429;

    if (isQuotaError) {
      console.log(`⚠️  Quota/rate limit detected for ${modelName}, will try fallback model`);
      throw new Error(`QUOTA_ERROR: ${error.message}`);
    }

    throw new Error(`Analysis failed: ${error.message}`);
  }
}

/**
 * Get a single resume by ID
 * @route GET /api/resumes/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM resumes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    const resume = result.rows[0];

    // Parse JSON fields if they exist
    if (resume.work_experience) {
      resume.work_experience = JSON.parse(resume.work_experience);
    }
    if (resume.education) {
      resume.education = JSON.parse(resume.education);
    }
    if (resume.technical_skills) {
      resume.technical_skills = JSON.parse(resume.technical_skills);
    }
    if (resume.soft_skills) {
      resume.soft_skills = JSON.parse(resume.soft_skills);
    }
    if (resume.projects) {
      resume.projects = JSON.parse(resume.projects);
    }
    if (resume.certifications) {
      resume.certifications = JSON.parse(resume.certifications);
    }
    if (resume.analysis_result) {
      resume.analysis_result = JSON.parse(resume.analysis_result);
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    next(error);
  }
};

/**
 * Get all resumes with pagination and filtering
 * @route GET /api/resumes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllResumes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Build the WHERE clause
    const whereClauses = [];
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereClauses.push(`(file_name ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count for pagination
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*) FROM resumes ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const queryText = `
      SELECT 
        id, 
        file_name, 
        name,
        email,
        phone,
        linkedin_url,
        portfolio_url,
        summary,
        work_experience,
        education,
        technical_skills,
        soft_skills,
        projects,
        certifications,
        resume_rating,
        improvement_areas,
        upskill_suggestions,
        uploaded_at
      FROM resumes 
      ${whereClause}
      ORDER BY uploaded_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await query(queryText, [...queryParams, limit, offset]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext,
        hasPrevious,
        nextPage: hasNext ? parseInt(page) + 1 : null,
        previousPage: hasPrevious ? parseInt(page) - 1 : null,
      },
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    next(error);
  }
};

/**
 * Analyzes resume text using AI with model fallback
 * @param {string} text - The resume text to analyze
 * @returns {Promise<Object>} The analysis result
 */
async function analyzeResumeWithAI(text) {
  console.log('🚀 Starting resume analysis with AI...');

  // First try with the PRO model
  try {
    console.log('📊 Attempting analysis with Gemini PRO model...');
    const result = await analyzeWithModel(text, config.defaultModel);
    console.log('✅ Resume analysis completed successfully using PRO model');
    return result;
  } catch (error) {
    console.warn(`⚠️  PRO model failed: ${error.message}`);

    // Check if it's a quota error that should trigger fallback
    if (error.message.includes('QUOTA_ERROR')) {
      console.log('🔄 Quota error detected, switching to FLASH model...');

      try {
        const result = await analyzeWithModel(text, config.fallbackModel);
        console.log('✅ Resume analysis completed successfully using FLASH model (fallback)');
        return result;
      } catch (fallbackError) {
        console.error('❌ Both PRO and FLASH models failed');
        console.error('PRO model error:', error.message);
        console.error('FLASH model error:', fallbackError.message);
        throw new Error('Gemini API failed on both models');
      }
    } else {
      // For non-quota errors, don't try fallback
      console.error('❌ PRO model failed with non-quota error, not attempting fallback');
      throw new Error('Failed to analyze resume with AI. Please try again later.');
    }
  }
}

/**
 * Update a resume by ID
 * @route PUT /api/resumes/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateResume = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if resume exists
    const checkResult = await query('SELECT id FROM resumes WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    // Build the update query dynamically based on provided fields
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;

    // List of allowed fields that can be updated
    const allowedFields = [
      'name',
      'email',
      'phone',
      'linkedin_url',
      'portfolio_url',
      'summary',
      'resume_rating',
      'status',
      'analysis_result',
    ];

    // Add fields to update if they exist in the request body
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        // For JSON fields, stringify them
        const fieldValue =
          key === 'analysis_result' && typeof value === 'object' ? JSON.stringify(value) : value;

        updateFields.push(`${key} = $${paramIndex}`);
        queryParams.push(fieldValue);
        paramIndex++;
      }
    }

    // If no valid fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields provided for update',
      });
    }

    // Add the ID to the query params
    queryParams.push(id);

    // Build and execute the update query
    const updateQuery = `
      UPDATE resumes 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(updateQuery, queryParams);

    // Parse JSON fields in the response
    const updatedResume = result.rows[0];
    if (updatedResume.analysis_result) {
      updatedResume.analysis_result = JSON.parse(updatedResume.analysis_result);
    }

    res.json({
      success: true,
      message: 'Resume updated successfully',
      data: updatedResume,
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    next(error);
  }
};

/**
 * Delete a resume by ID
 * @route DELETE /api/resumes/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteResume = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM resumes WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    next(error);
  }
};

/**
 * Upload and analyze a resume
 * @route POST /api/resumes/upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const uploadResume = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded. Please upload a PDF file.',
    });
  }

  // Validate file type
  if (!config.supportedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported file type. Please upload a PDF file.',
    });
  }

  try {
    const { buffer, originalname } = req.file;

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    // Analyze with AI
    const analysisResult = await analyzeResumeWithAI(text);

    // Save to database
    const result = await query(
      `INSERT INTO resumes (
        file_name, file_size, name, email, phone, linkedin_url, portfolio_url, 
        summary, work_experience, education, technical_skills, 
        soft_skills, projects, certifications, resume_rating, 
        improvement_areas, upskill_suggestions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id`,
      [
        originalname,
        buffer.length, // file_size
        analysisResult.personalInfo?.name || null,
        analysisResult.personalInfo?.email || null,
        analysisResult.personalInfo?.phone || null,
        analysisResult.personalInfo?.linkedin || null,
        analysisResult.personalInfo?.portfolio || null,
        analysisResult.summary || null,
        JSON.stringify(analysisResult.workExperience || []),
        JSON.stringify(analysisResult.education || []),
        JSON.stringify(analysisResult.skills?.technical || []),
        JSON.stringify(analysisResult.skills?.soft || []),
        JSON.stringify(analysisResult.projects || []),
        JSON.stringify(analysisResult.certifications || []),
        analysisResult.analysis?.rating || 0,
        analysisResult.analysis?.improvementAreas?.join('\n') || null,
        JSON.stringify(analysisResult.analysis?.recommendations || []),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        id: result.rows[0].id,
        ...analysisResult,
      },
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    next(error);
  }
};
