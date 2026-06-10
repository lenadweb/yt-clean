import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { storage } from 'src/shared/storage';
import '@assets/styles/index.css';

storage.init();

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(<App />);
