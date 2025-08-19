# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based student tracking system with separate interfaces for teachers and students. The application uses Vite as the build tool and Zustand for state management.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server with HMR
- **Build**: `npm run build` - Creates production build
- **Linting**: `npm run lint` - Run ESLint checks
- **Lint fix**: `npm run lint:fix` - Auto-fix ESLint issues
- **Format**: `npm run format` - Format code with Prettier
- **Format check**: `npm run format:check` - Check code formatting
- **Preview**: `npm run preview` - Preview production build

## Architecture

### User Types & Authentication
- Two distinct user types: `teacher` and `student`
- Teachers have real backend authentication via `/api/teachers/login` and `/api/teachers`
- Students use hardcoded credentials (`student`/`student` for login)
- Authentication state managed in `src/store/authStore.js`

### Component Organization
- **Pages**: `src/pages/` - Main route components (TeacherHome.jsx, StudentHome.jsx)
- **Components**: Organized by user type:
  - `src/components/teacher/component/` - Teacher-specific components
  - `src/components/teacher/modal/` - Teacher modals
  - `src/components/student/component/` - Student-specific components  
  - `src/components/student/modal/` - Student modals

### State Management (Zustand)
All stores located in `src/store/`:
- `authStore.js` - Authentication state and user management
- `uiStore.js` - UI state (current view, modals)
- `classroomStore.js` - Classroom/class management
- `sessionStore.js` - Session management
- `studentsStore.js` - Student data management
- `attendanceStore.js` - Attendance tracking
- `wrongPatternStore.js` - Wrong answer pattern analysis

### API Integration
- Backend API proxy configured for `localhost:8080` in `vite.config.js`
- API modules in `src/api/`:
  - `teacherApi.js` - Teacher authentication and management
  - `classroomApi.js` - Classroom CRUD operations
- All API calls use `/api` prefix and include comprehensive error handling

### Key Features by User Type

**Teacher Features:**
- Dashboard with overview
- Class/classroom management (create, edit, delete)
- Session management 
- Result input for student assessments

**Student Features:**
- Personal dashboard with progress metrics
- Session information and progress tracking
- Grade reports with charts (using Chart.js/Recharts)
- Attendance checking
- Wrong answer pattern analysis

## Code Conventions

- React functional components with hooks
- CSS modules with component-specific styles
- Zustand for state management instead of Redux
- ESLint config includes React-specific rules and Prettier integration
- No TypeScript - pure JavaScript with JSX
- Chart visualizations using both Chart.js and Recharts libraries

## Development Notes

- The project uses a component/modal folder structure to separate regular components from modal dialogs
- Many components contain hardcoded sample data for development
- Backend integration is partially implemented (teachers have real API, students use mock data)
- Vite proxy forwards `/api` requests to `localhost:8080` for backend development