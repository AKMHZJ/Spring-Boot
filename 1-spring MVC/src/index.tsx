import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SpringMVCTutorial from './spring_mvc_tutorial.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SpringMVCTutorial />
  </React.StrictMode>
);