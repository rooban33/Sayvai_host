import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
