import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enregistrement du Service Worker PWA pour le support hors-ligne
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('BâtiDevis SW actif:', reg.scope);
      })
      .catch((err) => {
        console.warn('BâtiDevis SW notice:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
