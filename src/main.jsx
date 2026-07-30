import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Register Service Worker with update handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/personal-hub/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // New service worker activated, reload to get latest content
              if (confirm('发现新版本，是否刷新页面获取最新内容？')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });

    // Force check for update
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/personal-hub">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
