import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ChatWidget />
  </React.StrictMode>
);
