# Styles Directory Structure

This directory contains all CSS styles for the frontend application, organized to mirror the component and page structure.

## Directory Structure

```
src/styles/
├── index.js              # Style exports (optional, for easier imports)
├── App.css              # Main app component styles
├── global.css           # Global styles and CSS variables
├── pages/               # Page-specific styles
│   ├── public/          # Public page styles
│   │   └── resume_page.css
│   ├── admin/           # Admin page styles
│   │   └── ResumeManager.css
│   ├── auth/            # Authentication page styles
│   └── game/            # Game page styles
├── components/          # Component-specific styles
│   └── ObjectDebugger.css
└── game/               # Game-specific styles
```

## Import Conventions

### From Pages
- Import relative to the page location: `import '../../styles/pages/admin/ResumeManager.css'`

### From Components
- Import relative to the component location: `import '../styles/components/ComponentName.css'`

### Global Styles
- Import in index.js: `import './styles/global.css'`

## Naming Conventions

- Use snake_case for file names to match page naming: `resume_page.css`
- Use PascalCase for component styles: `ResumeManager.css`
- Use kebab-case for CSS classes: `.resume-manager`

## CSS Organization

Each CSS file should:
1. Start with the main component/page styles
2. Include sub-component styles
3. End with responsive media queries
4. Use consistent spacing and color variables

## Color Palette

Primary colors used throughout the application:
- Primary gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Background: `#f8f9fa`
- Text: `#333` (primary), `#666` (secondary)
- Borders: `#e9ecef`, `#ddd`
- Success: `#28a745`
- Warning: `#ffc107`
- Danger: `#dc3545`
