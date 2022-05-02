import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from "../core/model/store";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
