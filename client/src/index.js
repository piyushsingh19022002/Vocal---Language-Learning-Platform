import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalProvider from './levels/globalfile';
import './styles/App.css';
import App from './App';
import { store } from './Score/store';
import {Provider} from "react-redux"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <GlobalProvider>
    <App />
    </GlobalProvider>
    </Provider>
  
  </React.StrictMode>
);

