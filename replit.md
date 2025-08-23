# Overview

This is a static Roblox Builder Portfolio website that showcases building projects and achievements. The application is a front-end only portfolio site built with vanilla HTML, CSS, and JavaScript, designed to display a collection of Roblox building projects with an image gallery and project details. The site features a modern, clean design with smooth animations and user interactions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Technology Stack**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Design Pattern**: Single Page Application (SPA) with smooth scrolling navigation
- **Styling Approach**: CSS custom properties (CSS variables) for consistent theming and modern CSS Grid/Flexbox for layouts
- **Font System**: Inter font family with Google Fonts integration for typography
- **Responsive Design**: Mobile-first approach with container-based max-width constraints

## Component Structure
- **Modular JavaScript**: Class-based architecture with `PortfolioApp` main controller
- **Event-Driven**: Centralized event handling for modal interactions, lightbox functionality, and navigation
- **Dynamic Content Loading**: JSON-based project data loading with error handling
- **Interactive Elements**: Modal system for project details and lightbox gallery for image viewing

## Data Management
- **Static Data Storage**: Projects stored in `projects.json` file with structured data including titles, descriptions, thumbnails, and image arrays
- **Client-Side Rendering**: Dynamic DOM manipulation for project cards and modal content
- **Image Handling**: External image hosting via Pixabay URLs for project thumbnails and galleries

## Security and Protection Features
- **Code Protection**: Anti-debugging measures including disabled right-click, F12 blocking, and keyboard shortcut restrictions
- **Content Protection**: Disabled text selection and save functionality to prevent easy content copying
- **User Experience**: Maintains usability while implementing basic content protection measures

## Performance Considerations
- **Lazy Loading**: Fetch-based JSON loading with async/await pattern
- **CSS Optimization**: Efficient use of CSS custom properties and minimal external dependencies
- **Image Optimization**: External CDN usage for images to reduce bundle size

# External Dependencies

## Third-Party Services
- **Google Fonts**: Inter font family hosted via Google Fonts CDN for typography
- **Pixabay CDN**: External image hosting service for all project thumbnails and gallery images

## Browser APIs
- **Fetch API**: For loading project data from JSON files
- **DOM Manipulation**: Native JavaScript for dynamic content rendering
- **Event Handling**: Browser native event system for user interactions

## Asset Dependencies
- **Font Loading**: Preconnect optimization for Google Fonts with fallback system fonts
- **Image Assets**: All images externally hosted, no local image dependencies
- **No Build Tools**: Direct browser execution without compilation or bundling requirements