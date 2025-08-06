# Accessibility Guidelines

## WCAG 2.1 Compliance

### Level AA Standards
- Ensure all interactive elements are keyboard accessible
- Maintain color contrast ratios of at least 4.5:1 for normal text
- Provide alternative text for all images
- Ensure all form elements have proper labels
- Make all functionality available via keyboard

### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3, etc.)
- Use semantic HTML elements (nav, main, section, article)
- Implement proper form structure with fieldsets and legends
- Use lists (ul, ol) for grouped content
- Use tables only for tabular data with proper headers

## React Accessibility

### Component Accessibility
- Use proper ARIA attributes when semantic HTML isn't sufficient
- Implement focus management for dynamic content
- Provide screen reader announcements for state changes
- Use proper role attributes for custom components
- Ensure all interactive elements have accessible names

### Form Accessibility
- Associate labels with form controls
- Provide clear error messages
- Use fieldsets for grouped form controls
- Implement proper validation feedback
- Use autocomplete attributes where appropriate

### Navigation Accessibility
- Implement skip links for keyboard users
- Provide clear focus indicators
- Use proper heading structure for page navigation
- Implement breadcrumbs where appropriate
- Ensure consistent navigation patterns

## Visual Design Accessibility

### Color and Contrast
- Never rely on color alone to convey information
- Ensure sufficient color contrast for all text
- Test with color blindness simulators
- Provide alternative indicators for color-coded information
- Use patterns or icons in addition to color

### Typography
- Use readable font sizes (minimum 16px for body text)
- Ensure adequate line spacing (1.5x font size minimum)
- Limit line length for readability (45-75 characters)
- Use clear, readable fonts
- Provide text scaling support

### Layout and Spacing
- Ensure touch targets are at least 44px × 44px
- Provide adequate spacing between interactive elements
- Use consistent layout patterns
- Ensure content reflows properly at different zoom levels
- Avoid horizontal scrolling at standard zoom levels

## Interactive Elements

### Buttons and Links
- Use button elements for actions, links for navigation
- Provide clear, descriptive text for all interactive elements
- Ensure all interactive elements are keyboard accessible
- Provide visual focus indicators
- Use proper ARIA states (expanded, pressed, selected)

### Forms
- Provide clear instructions and labels
- Group related form controls
- Indicate required fields clearly
- Provide helpful error messages
- Use autocomplete to help users fill forms

### Dynamic Content
- Announce important changes to screen readers
- Manage focus when content changes
- Provide loading states for async operations
- Ensure dynamic content is keyboard accessible
- Use proper ARIA live regions

## Testing and Validation

### Automated Testing
- Use axe-core for automated accessibility testing
- Integrate accessibility tests into CI/CD pipeline
- Use ESLint accessibility plugins
- Test with automated tools regularly
- Set up accessibility regression testing

### Manual Testing
- Test with keyboard navigation only
- Use screen readers (NVDA, JAWS, VoiceOver)
- Test with high contrast mode
- Verify with zoom levels up to 200%
- Test with users who have disabilities

### Browser Testing
- Test across different browsers and devices
- Verify assistive technology compatibility
- Test with different input methods
- Ensure consistent behavior across platforms
- Validate with browser accessibility tools

## Screen Reader Support

### Content Structure
- Use proper heading hierarchy for navigation
- Provide descriptive page titles
- Use landmarks to identify page regions
- Provide alternative text for meaningful images
- Use tables appropriately with proper headers

### Interactive Feedback
- Announce state changes to screen readers
- Provide context for form errors
- Use ARIA live regions for dynamic updates
- Ensure all interactive elements have accessible names
- Provide instructions for complex interactions

## Mobile Accessibility

### Touch Accessibility
- Ensure touch targets meet minimum size requirements
- Provide adequate spacing between touch targets
- Support gesture alternatives
- Test with assistive touch features
- Ensure content is accessible in both orientations

### Mobile Screen Readers
- Test with mobile screen readers (TalkBack, VoiceOver)
- Ensure proper swipe navigation
- Provide clear content structure
- Test with voice control features
- Verify zoom and magnification support

## Implementation Guidelines

### Development Process
- Include accessibility in design reviews
- Test accessibility during development
- Use accessibility linting tools
- Provide accessibility documentation
- Train team members on accessibility best practices

### Code Standards
- Use semantic HTML as the foundation
- Add ARIA attributes only when necessary
- Test all interactive functionality with keyboard
- Provide alternative text for all images
- Ensure proper focus management

### Quality Assurance
- Include accessibility in testing checklists
- Perform regular accessibility audits
- Test with real users who have disabilities
- Monitor accessibility metrics
- Address accessibility issues promptly

## Common Patterns

### Data Tables
- Use proper table headers (th elements)
- Associate data cells with headers using scope or headers attributes
- Provide table captions when needed
- Use thead, tbody, and tfoot appropriately
- Make sortable tables keyboard accessible

### Modal Dialogs
- Trap focus within the modal
- Return focus to trigger element when closed
- Provide proper ARIA attributes (role="dialog")
- Ensure keyboard accessibility (Escape to close)
- Announce modal opening to screen readers

### Charts and Visualizations
- Provide alternative text descriptions
- Include data tables as alternatives
- Use patterns and textures in addition to color
- Provide keyboard navigation for interactive charts
- Announce data changes to screen readers

## Resources and Tools

### Testing Tools
- axe DevTools browser extension
- WAVE Web Accessibility Evaluator
- Lighthouse accessibility audit
- Color contrast analyzers
- Screen reader testing tools

### Guidelines and Standards
- WCAG 2.1 Guidelines
- ARIA Authoring Practices Guide
- Platform-specific accessibility guidelines
- Industry accessibility standards
- Legal compliance requirements
