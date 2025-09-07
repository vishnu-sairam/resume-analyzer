# Contributing to Resume Analyzer

First off, thank you for considering contributing to Resume Analyzer! It's people like you that make open-source projects like this one possible.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [your-email@example.com].

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/resume-analyzer.git
   cd resume-analyzer
   ```
3. **Set up the development environment** (see [Development Setup](#development-setup)).
4. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number-description
   ```

## How to Contribute

### Reporting Bugs

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). When creating a bug report, please include:

1. A clear, descriptive title
2. A description of the problem
3. Steps to reproduce the issue
4. Expected vs. actual behavior
5. Screenshots if applicable
6. Your environment (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are also tracked as GitHub issues. When suggesting an enhancement, please include:

1. A clear, descriptive title
2. A detailed description of the enhancement
3. Why this enhancement would be useful
4. Any alternative solutions you've considered

### Your First Code Contribution

1. Look for issues labeled `good first issue` or `help wanted`.
2. Comment on the issue to let others know you're working on it.
3. Follow the [Development Setup](#development-setup) to get started.
4. Make your changes, following the [Coding Standards](#coding-standards).
5. Submit a pull request (see [Pull Requests](#pull-requests)).

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Update the CHANGELOG.md with your changes.
7. Issue the pull request.

## Development Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npm run db:init
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Coding Standards

### JavaScript/TypeScript

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ES6+ features
- Use `const` and `let` instead of `var`
- Use template literals for string interpolation
- Use named exports over default exports
- Use async/await over promises when possible

### React

- Use functional components with hooks
- Follow the [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- Use prop-types for prop validation
- Keep components small and focused
- Use meaningful component and variable names

### Styling

- Use Material-UI's `sx` prop for one-off styles
- Use styled-components for reusable styled components
- Follow the [Material-UI guidelines](https://mui.com/material-ui/getting-started/)

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Here are some examples:

- `feat: add new resume upload endpoint`
- `fix: resolve issue with PDF parsing`
- `docs: update API documentation`
- `style: format code with prettier`
- `refactor: improve resume analysis logic`
- `test: add tests for resume controller`
- `chore: update dependencies`

## Code Review Process

1. Create a pull request
2. Ensure all CI checks pass
3. Request reviews from maintainers
4. Address any feedback
5. Once approved, a maintainer will merge your PR

## Need Help?

If you have any questions about contributing, feel free to open an issue or reach out to [your-email@example.com].
