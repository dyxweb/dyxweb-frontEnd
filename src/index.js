import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import App from './routes';
import store from './redux/store.js'
import 'styles/common.less';
import 'highlight.js/styles/dark.css';
import 'babel-polyfill'

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/dyxweb-frontEnd">
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
);