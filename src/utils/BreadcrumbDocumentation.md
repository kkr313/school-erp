# Custom Breadcrumb Component Documentation

## Overview
The redesigned `CustomBreadcrumb` component provides a modern, glass-morphism styled navigation breadcrumb with multiple variants and features.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | The current page title (displayed as the last item) |
| `links` | array | `[]` | Array of breadcrumb links with `{label, href}` structure |
| `showHome` | boolean | `true` | Whether to show the home/dashboard link |
| `variant` | string | `"default"` | Visual variant: `"default"`, `"compact"`, `"minimal"` |
| `animated` | boolean | `true` | Enable hover animations and effects |

## Variants

### Default Variant
- **Usage**: `<CustomBreadcrumb title="Page Title" />`
- **Features**: Full glass-morphism effect, large padding, animated underline
- **Best for**: Main pages, dashboards, primary navigation

### Compact Variant
- **Usage**: `<CustomBreadcrumb title="Page Title" variant="compact" />`
- **Features**: Smaller size, reduced padding, subtle glass effect
- **Best for**: Dense layouts, modal headers, secondary pages

### Minimal Variant
- **Usage**: `<CustomBreadcrumb title="Page Title" variant="minimal" />`
- **Features**: No glass effect, transparent background, simple text
- **Best for**: Clean layouts, reports, when you need subtle navigation

## Auto-Generation Feature

The component automatically generates breadcrumbs based on the current URL path when no `links` prop is provided:

```jsx
// URL: /master/class-master
// Auto-generates: Dashboard > Master > Class Master (current page)
<CustomBreadcrumb title="Class Master Configuration" />
```

## Examples

### Basic Usage
```jsx
import CustomBreadcrumb from "../utils/CustomBreadcrumb";

<CustomBreadcrumb
  title="Student Admission"
  showHome={true}
/>
```

### With Custom Links
```jsx
<CustomBreadcrumb
  title="Fee Reports"
  links={[
    { label: "Reports", href: "/reports" },
    { label: "Financial", href: "/reports/financial" }
  ]}
/>
```

### Compact Variant for Dashboards
```jsx
<CustomBreadcrumb
  title="Admin Dashboard"
  variant="compact"
  animated={true}
/>
```

### Minimal Variant for Reports
```jsx
<CustomBreadcrumb
  title="Monthly Report"
  variant="minimal"
  showHome={false}
/>
```

## Styling Features

### Glass Morphism Effect
- Backdrop blur with transparency
- Gradient borders and backgrounds
- Subtle shadow effects
- Responsive design

### Interactive Elements
- Smooth hover transitions
- Scale animations on hover
- Color transitions
- Gradient text effects for current page

### Responsive Design
- Mobile-optimized layouts
- Hidden text on small screens (shows on hover)
- Adaptive icon sizes
- Flexible spacing

## Implementation Notes

### Migration from Old Breadcrumb
The new component is backward compatible. Simply replace:

**Old:**
```jsx
<CustomBreadcrumb
  title="Page Title"
  links={[{ label: "Dashboard", href: "/dashboard" }]}
/>
```

**New:**
```jsx
<CustomBreadcrumb
  title="Page Title"
  showHome={true}
/>
```

### CSS Dependencies
Requires Tailwind CSS classes and the following custom CSS (already included in index.css):
- `.glass` - Glass morphism base effect
- `.animate-pulse` - Pulse animation
- Gradient utilities

### Icons Used
- `MdHome` - Home/Dashboard icon
- `MdChevronRight` - Separator icon

## Performance
- Lightweight with minimal re-renders
- Uses React Router's Link component for SPA navigation
- Optimized hover states with CSS transitions
- Auto-memoized breadcrumb generation

## Accessibility
- Proper ARIA labels for screen readers
- Semantic HTML structure with nav and ol elements
- Keyboard navigation support
- High contrast color schemes
