# Contributing to Turtle Panes

Thank you for your interest in contributing to **Turtle Panes**! This project is designed to be a framework-agnostic state management library for both React and Vue, and we welcome high-quality contributions. Please read this guide carefully before submitting a pull request.

## Table of Contents

- [Contributing to Turtle Panes](#contributing-to-turtle-panes)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Development](#development)
  - [How to Contribute](#how-to-contribute)
    - [Feature Requests \& Proposals](#feature-requests--proposals)
    - [Bug Reports](#bug-reports)
    - [Submitting Code Changes](#submitting-code-changes)
  - [Code Standards](#code-standards)
  - [Testing Requirements](#testing-requirements)
  - [Pull Request Checklist](#pull-request-checklist)

---

## Code of Conduct

By participating in this project, you agree to uphold a respectful and collaborative environment. Any form of harassment or discrimination will not be tolerated.

## Development

To start development:

1. Install dependencies:
```bash
npm install
```

2. Run development server:
   - For Vue demo:
   ```bash
   npm run dev
   ```
   - For React demo:
   ```bash
   npm run dev:react
   ```

Both servers will hot-reload as you make changes.

## How to Contribute

### Feature Requests & Proposals

If you have an idea for a new feature, please **open an issue** first. Each feature request should clearly describe:

- **What the feature is** (detailed description)
- **Why it is needed** (problem it solves, use cases)
- **How it aligns with the project's goals** (ensure compatibility with React and Vue)
- **Any alternatives considered** (if applicable)

We will discuss and approve features before implementation to ensure they align with the vision of *Turtle Panes*.

### Bug Reports

If you find a bug, please open an issue with:

- A **clear description** of the issue
- Steps to reproduce the problem
- Expected vs. actual behavior
- A minimal reproducible example (CodeSandbox, GitHub repo, or inline code snippet)

### Submitting Code Changes

Once a feature or bug fix is approved, follow these steps:

1. **Fork the repository** and create a feature branch (`feature/your-feature-name` or `bugfix/issue-number`).
2. Follow the **Code Standards** and **Testing Requirements** (see below).
3. Ensure your changes **do not introduce external dependencies**.
4. Submit a **pull request (PR)** with:
   - A **clear description** of the changes
   - Reference to the issue it addresses (if applicable)
   - A summary of new/updated unit tests

## Code Standards

All contributions must adhere to the following:

- **No external libraries.**
- Code should be **modular, readable, and maintainable**.
- Use **TypeScript** for type safety.
- Maintain the **existing project structure** (`helpers`, `state`, `types`).
- Keep as much logic as possible in the @turtle-panes/core package.

## Testing Requirements

Every new feature or bug fix **must include unit tests**:

- Tests should be added in the appropriate file.
- Use **Jest** as the test runner.
- Anything added to @turtle-panes/core must be tested well
- Ensure **100% test coverage** for new code.
- Run tests locally (`npm run test`) before submitting.

## Pull Request Checklist

Before submitting your PR, make sure you:

- Have an Issue linked to it
- Have tested properly
- Have written clear description on what the PR contains
- What is the problem
- What is expected

We appreciate your contributions and look forward to building *Turtle Panes* together!

