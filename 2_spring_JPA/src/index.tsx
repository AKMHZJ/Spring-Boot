import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SpringJPATutorial from './spring_jpa_tutorial'; // Imports your file

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SpringJPATutorial />
  </React.StrictMode>
);