import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import Chat from './chatgpt/chat';

function Main() {

  return (
    <React.StrictMode>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<Chat />, rootElement);

export default Main;
