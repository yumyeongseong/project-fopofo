import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ root.render() 부분을 다시 활성화합니다.
root.render(
  // <React.StrictMode>  <= StrictMode만 주석 처리합니다.
  <App />
  // </React.StrictMode> <= StrictMode만 주석 처리합니다.
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();