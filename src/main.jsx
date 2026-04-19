import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TomoFil from './TomoFil.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TomoFil />
  </StrictMode>
);
