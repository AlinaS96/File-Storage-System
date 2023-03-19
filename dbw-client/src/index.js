import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
//This index.js file is just rendering that App.js component to the screen using DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  ////<React.StrictMode>
  <Router>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>
  </Router>
  //</React.StrictMode>
);