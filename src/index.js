import React from 'react';
import ReactDOM from 'react-dom/client';
import './tw.css' // This now correctly imports your styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

