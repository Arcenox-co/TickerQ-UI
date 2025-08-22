# Analytics Modal Setup Guide

This guide explains how to configure and use the analytics modal that collects anonymous usage data from TickerQ documentation visitors.

## Features

- 🎯 **Purpose-built for library analytics** - Collects relevant data about how TickerQ is being used
- 🍪 **Cookie-based persistence** - Shows only once per user, respects user choice
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 📱 **Mobile-friendly** - Works perfectly on all devices
- 🔒 **Privacy-focused** - All data collection is anonymous and optional
- ⚡ **Performance optimized** - Loads after page content, non-blocking

## Data Collected

The modal collects the following anonymous information:

### Required Fields
- **Usage Purpose**: What the user is using TickerQ for (web apps, microservices, etc.)
- **Organization Type**: Type of organization (startup, enterprise, personal, etc.)

### Optional Fields
- **Team Size**: Development team size
- **Industry**: Industry sector
- **Comments**: Free-form feedback and suggestions

### Automatic Data
- Timestamp
- User Agent (for browser/OS analytics)
- Current URL

## Setup Instructions

### 1. Choose Your Analytics Service

You have several options for collecting the form data:

#### Option A: Formspree (Recommended for simplicity)
1. Go to [Formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Copy your form endpoint URL
5. Update the `ANALYTICS_ENDPOINT` in `AnalyticsModal.vue`:

```typescript
const ANALYTICS_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
```

6. Uncomment the fetch code in the `handleSubmit` function

#### Option B: Custom API Endpoint
1. Create your own API endpoint that accepts POST requests
2. Update the `ANALYTICS_ENDPOINT` constant
3. Modify the fetch request if needed for authentication

#### Option C: Google Forms
1. Create a Google Form with matching fields
2. Use the form's submit URL
3. Adjust the payload format accordingly

#### Option D: Analytics Services
- **Mixpanel**: For detailed user analytics
- **Amplitude**: For product analytics
- **PostHog**: For open-source analytics
- **Custom Database**: Store directly in your own database

### 2. Configure the Modal

In `AnalyticsModal.vue`, you can customize:

```typescript
// Show delay (milliseconds)
setTimeout(() => {
  if (shouldShowModal.value) {
    isVisible.value = true
  }
}, 2000) // Change this value

// Storage key (if you want to namespace it)
const STORAGE_KEY = 'tickerq-analytics-modal'

// Form fields - add/remove as needed
const formData = reactive<FormData>({
  purpose: '',
  organizationType: '',
  teamSize: '',
  industry: '',
  comments: ''
})
```

### 3. Customize Form Fields

To add new fields:

1. Update the `FormData` interface
2. Add the field to the reactive form data
3. Add the HTML form element in the template
4. Update validation logic if needed

Example - adding a "Region" field:

```typescript
// 1. Update interface
interface FormData {
  purpose: string
  organizationType: string
  teamSize: string
  industry: string
  region: string  // Add this
  comments: string
}

// 2. Update reactive data
const formData = reactive<FormData>({
  purpose: '',
  organizationType: '',
  teamSize: '',
  industry: '',
  region: '',  // Add this
  comments: ''
})
```

Then add the HTML field in the template.

### 4. Testing

1. Clear your browser's localStorage for the site
2. Refresh the page
3. The modal should appear after 2 seconds
4. Test form submission and verify data reaches your endpoint
5. Refresh again - modal should not appear (stored in localStorage)

To reset for testing:
```javascript
// In browser console
localStorage.removeItem('tickerq-analytics-modal')
```

## Privacy Considerations

- All data collection is **completely anonymous**
- Users can easily decline or skip
- No personal information is collected
- Respects user choice permanently via localStorage
- GDPR compliant (anonymous, optional, transparent)

## Styling

The modal uses Tailwind CSS and is fully responsive. Key features:

- Dark mode support
- Smooth animations
- Mobile-first design
- Backdrop blur effect
- Focus management
- Keyboard navigation

## Analytics Insights

The data collected will help you understand:

- **User segments**: Who's using your library
- **Use cases**: How TickerQ is being implemented
- **Company sizes**: Scale of adoption
- **Industries**: Sector penetration
- **Feedback**: Direct user input for improvements

## Troubleshooting

### Modal not appearing
- Check browser console for errors
- Verify localStorage is clear
- Check the 2-second delay

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check dark mode setup
- Verify CSS imports in theme

### Form submission failing
- Check network tab for failed requests
- Verify endpoint URL is correct
- Check CORS settings on your API
- Ensure payload format matches your endpoint

### TypeScript errors
- Verify all imports are correct
- Check Vue 3 composition API usage
- Ensure proper type definitions

## Data Export

Depending on your chosen service:

- **Formspree**: Download CSV from dashboard
- **Google Forms**: View responses in Google Sheets
- **Custom API**: Implement your own export
- **Analytics Services**: Use their built-in reporting

## Performance Impact

The modal is designed to be lightweight:
- Loads after page content (2-second delay)
- Only shows once per user
- Minimal bundle size impact
- No external dependencies beyond Vue 3
- Uses browser's localStorage for persistence

## Customization Examples

### Change appearance delay
```typescript
setTimeout(() => {
  if (shouldShowModal.value) {
    isVisible.value = true
  }
}, 5000) // Show after 5 seconds instead
```

### Add custom validation
```typescript
const handleSubmit = async () => {
  // Custom validation
  if (formData.purpose === 'other' && !formData.comments.trim()) {
    error.value = 'Please provide details when selecting "Other"'
    return
  }
  
  // ... rest of submit logic
}
```

### Customize success message
```typescript
// In template
<div v-if="isSubmitted" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
  <p class="text-green-800 dark:text-green-200 text-sm">
    Thank you! Your feedback helps make TickerQ better for everyone! 🚀
  </p>
</div>
```

## Support

If you encounter any issues with the analytics modal setup, please check:

1. VitePress documentation for theme customization
2. Vue 3 Composition API documentation
3. Tailwind CSS documentation for styling
4. Your chosen analytics service documentation

The modal is fully self-contained and should work out of the box with any VitePress site using Vue 3 and Tailwind CSS.
