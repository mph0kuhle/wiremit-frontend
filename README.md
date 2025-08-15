
# Wiremit - Send Pocket Money App

A modern web application for Zimbabwean parents to send money to their children studying abroad (UK or South Africa). Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Sign Up**: Create account with name, email, and password
- **Login**: Secure login with form validation
- **Session Management**: Persistent login using localStorage
- **Input Validation**: Real-time validation with error messages

### Dashboard
- **Send Money Section**: 
  - USD input with min/max validation ($10 - $10,000)
  - Real-time FX rate conversion for GBP and ZAR
  - Dynamic fee calculation (10% for GBP, 20% for ZAR)
  - Rounded-up calculations for accuracy
  - Visual currency cards with flag indicators
  
- **Ads Carousel**: 
  - Auto-rotating advertisements
  - Manual navigation with indicators
  - Smooth transitions with Framer Motion
  
- **Transaction History**: 
  - 15 mock transactions with pagination
  - Searchable and sortable data
  - Mobile-responsive table design

### Technical Features
- **Live FX Rates**: Integration with backend API for real-time rates
- **Mobile-First Design**: Fully responsive across all devices
- **Animations**: Smooth transitions using Framer Motion
- **Glass Morphism UI**: Modern design with backdrop blur effects
- **Accessibility**: Proper focus management and keyboard navigation
- **Error Handling**: Graceful fallbacks for API failures

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit the development URL

## 🔧 Backend Integration

The app integrates with a backend API running at:
```
https://supreme-waffle-x5xvq76gwxp6c6rqg-8000.app.github.dev
```

### API Endpoints
- `GET /rates` - Fetch current exchange rates
- `POST /signup` - User registration (future implementation)
- `POST /login` - User authentication (future implementation)

## 📱 Design Decisions

### Authentication Storage
- **Choice**: localStorage for session persistence
- **Rationale**: Simple implementation for MVP, easy to migrate to JWT/cookies later
- **Security**: Client-side only, suitable for technical interview demo

### Currency Support
- **Current**: USD, GBP, ZAR
- **Scalable**: Architecture supports easy addition of new currencies
- **Fee Structure**: Configurable per currency (10% GBP, 20% ZAR)

### State Management
- **Choice**: React useState/useEffect
- **Rationale**: Sufficient for current scope, can migrate to Redux/Zustand if needed
- **Data Flow**: Unidirectional flow with prop drilling

### Mobile Responsiveness
- **Approach**: Mobile-first design with Tailwind CSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Minimum 44px for mobile accessibility

## 🔒 Security Considerations

### Current Implementation
- Input validation and sanitization
- XSS prevention through React's built-in protections
- HTTPS for API communications
- Environment-based configuration

### Future Enhancements
- JWT token authentication
- CSRF protection
- Rate limiting
- Input sanitization middleware
- Secure password hashing

## 🎨 UI/UX Features

### Visual Design
- **Glass morphism**: Modern backdrop blur effects
- **Gradient backgrounds**: Multi-color gradients for visual appeal
- **Smooth animations**: Framer Motion for enhanced UX
- **Color coding**: Currency-specific colors for easy identification

### Accessibility
- **Keyboard navigation**: Full keyboard support
- **Focus management**: Clear focus indicators
- **Screen reader support**: Semantic HTML and ARIA labels
- **Color contrast**: WCAG AA compliant color schemes

### User Feedback
- **Loading states**: Skeleton screens and spinners
- **Error messages**: Clear, actionable error descriptions
- **Success indicators**: Visual confirmation of actions
- **Validation feedback**: Real-time form validation

## 📈 Scalability Considerations

### Architecture
- **Component modularity**: Reusable, composable components
- **API abstraction**: Centralized API client for easy updates
- **Configuration management**: Environment-based settings

### Future Enhancements
- **Multi-currency support**: Easy addition of new currencies
- **Payment methods**: Support for different payment providers
- **Multi-country**: Expansion to other African countries
- **Real-time updates**: WebSocket integration for live rates

## 🚀 Deployment

The app is configured for deployment on Replit with:
- Automatic dependency installation
- Environment variable support
- Production build optimization
- Static file serving

### Build Process
```bash
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Code linting
```

## 🧪 Testing Strategy

### Current Testing
- Manual testing across devices
- Cross-browser compatibility
- API integration testing
- Form validation testing

### Future Testing
- Unit tests with Jest/Vitest
- Integration tests with React Testing Library
- E2E tests with Playwright/Cypress
- Performance testing with Lighthouse

## 📝 Development Notes

### Code Organization
```
src/
├── components/     # React components
├── api/           # API client functions
├── config.ts      # Configuration constants
├── App.tsx        # Main app component
└── main.tsx       # App entry point
```

### Key Components
- **App.tsx**: Main routing and authentication logic
- **Login.tsx**: User authentication form
- **Signup.tsx**: User registration form
- **Dashboard.tsx**: Main application dashboard

### Data Flow
1. User authentication through Login/Signup
2. Session stored in localStorage
3. Dashboard fetches live FX rates from API
4. Real-time calculations for money transfers
5. Transaction history and ads displayed

## 🤝 Contributing

This is a technical interview project. The implementation focuses on:
- Clean, readable code
- Modern React patterns
- Responsive design principles
- User experience optimization
- Scalable architecture

## 📄 License

This project is part of a technical interview for Wiremit.
