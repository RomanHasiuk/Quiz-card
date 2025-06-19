// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bulma/css/bulma.min.css'; // Імпортуємо Bulma CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
