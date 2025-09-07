# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of our project seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

### How to Report a Vulnerability

To report a security vulnerability, please follow these steps:

1. **Do not** create a public GitHub issue for security vulnerabilities.
2. Send an email to [security@example.com](mailto:security@example.com) with the following details:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Any potential impact of the vulnerability
   - Your name and affiliation (if any)
   - Your contact information

### Our Commitment

- We will acknowledge receipt of your report within 48 hours.
- We will confirm the vulnerability and determine its impact.
- We will keep you informed of the progress towards fixing the vulnerability.
- Once the issue is resolved, we will publicly acknowledge your responsible disclosure (unless you prefer to remain anonymous).

## Security Best Practices

### For Users

- Always keep your dependencies up to date
- Use strong, unique passwords for your accounts
- Enable two-factor authentication where available
- Be cautious when uploading sensitive information
- Regularly review your account activity

### For Developers

- Follow the principle of least privilege
- Never store sensitive information in version control
- Use environment variables for configuration
- Validate all user input
- Implement proper error handling
- Use prepared statements for database queries
- Keep dependencies up to date
- Regularly audit your code for security vulnerabilities

## Security Measures

### Data Protection

- All sensitive data is encrypted at rest and in transit
- Passwords are hashed using bcrypt
- API keys and credentials are stored securely using environment variables
- Regular security audits are performed

### Authentication & Authorization

- JWT-based authentication with secure token handling
- Role-based access control (RBAC)
- Secure password reset functionality
- Session management with appropriate timeouts

### File Uploads

- File type validation
- File size limits
- Virus scanning (recommended for production)
- Secure file storage with appropriate permissions

## Dependencies

We regularly update our dependencies to ensure all known security vulnerabilities are addressed. You can check for known vulnerabilities using:

```bash
# For backend
cd backend
npm audit

# For frontend
cd frontend
npm audit
```

## Security Updates

Security updates are released as patch versions (e.g., 1.0.0 → 1.0.1). We recommend always using the latest version of our software.

## Contact

For any security-related questions or concerns, please contact us at [security@example.com](mailto:security@example.com).

## Credits

We would like to thank all security researchers and users who have reported security vulnerabilities and helped improve the security of our project.
