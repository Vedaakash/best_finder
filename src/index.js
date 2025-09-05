import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css'; // This is the crucial change
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);