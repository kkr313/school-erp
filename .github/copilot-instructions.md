# School ERP System - AI Development Guide

## Project Overview
This is a React-based School Management ERP system built with Vite, Material-UI, and Tailwind CSS. The app features a comprehensive dashboard for managing students, fees, attendance, exams, and school operations.

## Architecture Patterns

### Component Organization
- **Dashboard Components**: Located in `src/components/Dashboard/` - each module has its own dashboard (AdminDashboard, CollectionDashboard, AttendanceDashboard, etc.)
- **Dropdown Components**: Reusable form dropdowns in `src/components/Dropdown/` that fetch data from APIs (Class.jsx, Section.jsx, etc.)
- **Utility Components**: Custom styled components in `src/utils/` (FilledTextField.jsx, FilledAutocomplete.jsx)
- **Feature Modules**: Organized by domain (Attendance/, Collection/, Exam/, Master/, Report/)

### API Integration Pattern
All API calls use the custom `useApi` hook from `src/utils/useApi.jsx`:
```jsx
const { callApi, loading, error } = useApi();
const data = await callApi("/api/endpoint", { ...bodyData });
```
- Base URL: `https://teo-vivekanadbihar.co.in/TEO-School-API`
- All requests are POST with specific headers (BS-SchoolCode, BS-AuthorizationToken)
- Standard request body includes `trackingID: "string"`

### Theme System
The app uses a comprehensive theme context (`src/context/ThemeContext.jsx`):
- Dynamic color calculations based on background darkness
- Separate styling for forms, navigation, and print layouts
- Font family and color customization per component type
- Special handling for white backgrounds with blue accent colors

### Routing & Authentication
- Uses `unstable_HistoryRouter` with custom history object (`src/history.jsx`)
- Protected routes with `ProtectedRoute` component wrapper
- Authentication state managed via React Context (`AuthContext`)
- Responsive layout with collapsible sidebar and mobile navigation

## Development Conventions

### Form Components
- Use `FilledTextField` and `FilledAutocomplete` from utils for consistent styling
- Dropdown components follow naming pattern: `Get[Entity]` or just entity name
- All form inputs should respect theme colors and respond to dark/light backgrounds

### Dashboard Cards
- Use `ModernDashboardCard` component with props: `label`, `icon`, `color`, `path`, `description`
- Features array pattern for dashboard navigation (see `src/components/Dashboard/Dashboard.jsx`)
- Icons from react-icons with consistent color coding

### Menu Navigation
- Global menu items defined in `src/utils/globalMenuItems.js`
- Categorized into: main menu, master items, attendance, exam, collection, report, config
- Uses object imports for icons to avoid JSX in JS files

### Styling Approach
- Material-UI components with custom theme integration
- Tailwind CSS for utility classes
- Dynamic styling based on theme context colors
- Responsive design with mobile-first approach

## Key File Patterns

### API Dropdown Components
Pattern used in `src/components/Dropdown/[Entity].jsx`:
```jsx
const { callApi } = useApi();
useEffect(() => {
  const fetchData = async () => {
    const data = await callApi("/api/endpoint", { trackingID: "string" });
    // Transform data to { label, value } format
  };
}, []);
```

### Dashboard Module Structure
Each module follows: `[Module]Dashboard.jsx` → feature cards → individual components
- Example: `CollectionDashboard.jsx` → `FeeCollection.jsx`, `DuesCollection.jsx`

### Print Components
- Print-specific components in `src/components/PrintPDF/`
- Uses `react-to-print` library with theme-aware styling
- Separate print theme configuration in ThemeContext

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Critical Dependencies
- **Core**: React 19, Vite, React Router DOM
- **UI**: Material-UI, Tailwind CSS, Framer Motion
- **Charts**: Recharts for data visualization
- **Icons**: React Icons, Material-UI Icons, Lucide React
- **Utils**: date-fns for date handling, react-to-print for printing

## Authentication Flow
Session storage keys:
- `schoolCode` - Required for API headers
- `token` - Authorization token for API requests
- Auto-logout functionality implemented in main App component

When adding new features, follow the established patterns for API integration, theming, and component organization to maintain consistency across the application.