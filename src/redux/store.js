import { createStore, combineReducers } from 'redux';
import { loginStore } from './login/reducers.js';

const rootReducers = combineReducers({
  loginStore,
})
let store = createStore(rootReducers);
export default store;