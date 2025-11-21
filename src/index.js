import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'development') {
  console.log(`
  🚀 ABIDGPT is running in development mode
  📱 App Name: ${process.env.REACT_APP_APP_NAME || 'ABIDGPT'}
  🔧 Environment: ${process.env.NODE_ENV}
  `);
}

// Error boundary for better error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}