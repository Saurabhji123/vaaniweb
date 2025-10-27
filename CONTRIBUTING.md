# Contributing to VaaniWeb 🚀

Thank you for considering contributing to **VaaniWeb**! We're excited to have you here. This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [How to Contribute](#-how-to-contribute)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Adding New Features](#-adding-new-features)
- [Bug Reports](#-bug-reports)
- [Security Issues](#-security-issues)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards:
- ✅ Be respectful and considerate in all interactions
- ✅ Welcome newcomers and help them get started
- ✅ Provide constructive feedback
- ✅ Focus on collaboration and learning
- ✅ Accept responsibility and apologize when mistakes happen
- ❌ No harassment, discrimination, or trolling
- ❌ No personal attacks or inflammatory comments

**Violations**: Report to [vaaniweb@gmail.com](mailto:vaaniweb@gmail.com)

---

## 🎯 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git** installed
- A **MongoDB Atlas** account (for database)
- **Resend API Key** (for email functionality)
- **Groq API Key** (for AI generation)

### Fork and Clone

1. **Fork** this repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vaaniweb.git
   cd vaaniweb
   ```

---

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key

# Resend Email API
RESEND_API_KEY=your_resend_api_key

# Groq AI API
GROQ_API_KEY=your_groq_api_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test Your Setup

- Visit `/register` and create a test account
- Check email functionality at `/test-email`
- Generate a test website

---

## 💡 How to Contribute

### 1. Choose What to Work On

- Browse [open issues](https://github.com/Saurabhji123/vaaniweb/issues)
- Look for `good first issue` or `help wanted` labels
- Check our [project board](https://github.com/Saurabhji123/vaaniweb/projects)
- Suggest new features via issues

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# OR
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 3. Make Your Changes

- Write clean, readable code
- Follow our coding standards (see below)
- Add comments for complex logic
- Update documentation if needed

### 4. Test Thoroughly

- Test all affected functionality
- Check console for errors
- Test on different screen sizes (responsive)
- Verify email flows work correctly
- Test with different business types

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new template for restaurants"
```

See [Commit Guidelines](#-commit-guidelines) for formatting.

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use TypeScript types
interface User {
  id: string;
  email: string;
  name: string;
}

async function getUser(userId: string): Promise<User> {
  // implementation
}

// ❌ Bad: No types
async function getUser(userId) {
  // implementation
}
```

### React/Next.js Best Practices

```typescript
// ✅ Use 'use client' when needed
'use client';

import { useState } from 'react';

// ✅ Named exports for components
export function UserProfile() {
  const [loading, setLoading] = useState(false);
  
  // Component logic
}

// ✅ Descriptive function names
const handleSubmit = async () => {
  // ...
};
```

### API Route Standards

```typescript
// ✅ Consistent error handling
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Business logic
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### CSS/Styling

- Use **Tailwind CSS** classes
- Maintain consistent spacing
- Ensure responsive design
- Use semantic color classes

```tsx
// ✅ Good: Tailwind with responsive design
<div className="w-full max-w-md mx-auto p-4 md:p-6 lg:p-8">
  <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
    Submit
  </button>
</div>
```

---

## 📌 Commit Guidelines

We follow **Conventional Commits** specification.

### Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples:

```bash
# Feature
git commit -m "feat(templates): add new restaurant template with menu showcase"

# Bug fix
git commit -m "fix(auth): resolve OTP email not sending issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Multiple changes
git commit -m "feat(ui): add dark mode toggle

- Add theme context provider
- Update all components for dark mode
- Add theme toggle in navigation
- Persist theme preference in localStorage"
```

---

## � Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console warnings/errors
- [ ] Tested on multiple screen sizes
- [ ] All existing features still work

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the project guidelines
- [ ] I have tested my changes
- [ ] I have updated documentation
- [ ] No new warnings/errors introduced
```

### Review Process

1. At least **1 maintainer approval** required
2. All **automated checks** must pass
3. Address all **review comments**
4. **Squash commits** if requested
5. Maintainer will merge after approval

---

## ✨ Adding New Features

### Adding a New Template

1. **Create Template File**
   ```typescript
   // app/lib/templates/your-template.ts
   import { BusinessData } from '@/app/types';
   
   export function generateYourTemplate(data: BusinessData): string {
     return `
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>${data.businessName}</title>
         <!-- Your styles -->
       </head>
       <body>
         <!-- Your template HTML -->
         <footer>
           Made with ❤️ by <a href="https://vaaniweb.com">VaaniWeb</a>
         </footer>
       </body>
       </html>
     `;
   }
   ```

2. **Import in Generator**
   ```typescript
   // app/lib/html-generator.ts
   import { generateYourTemplate } from './templates/your-template';
   
   export function generateHTML(data: BusinessData, templateId: number): string {
     switch (templateId) {
       case 1:
         return generateYourTemplate(data);
       // ... other cases
     }
   }
   ```

3. **Test Template**
   - Test with different business data
   - Verify responsive design
   - Check on mobile devices
   - Ensure all links work

### Adding API Endpoints

```typescript
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Your logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

---

## � Bug Reports

### Before Reporting

1. Search existing issues
2. Try latest version
3. Reproduce the bug consistently

### Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 18.17.0]
- Next.js Version: [e.g., 14.0.0]

## Additional Context
Any other relevant information
```

---

## 🔐 Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email: [vaaniweb@gmail.com](mailto:vaaniweb@gmail.com)
2. Include detailed description
3. Steps to reproduce
4. Potential impact
5. Suggested fix (if any)

We'll respond within **48 hours**.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Resend API Docs](https://resend.com/docs)

---

## 💬 Questions?

- **GitHub Discussions**: [Ask questions](https://github.com/Saurabhji123/vaaniweb/discussions)
- **Issues**: Tag with `question` label
- **Email**: [vaaniweb@gmail.com](mailto:vaaniweb@gmail.com)

---

## � Thank You!

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in making **VaaniWeb** better!

**Happy Coding!** 🎉✨

---

<p align="center">
  Made with ❤️ by the VaaniWeb Community
</p>

