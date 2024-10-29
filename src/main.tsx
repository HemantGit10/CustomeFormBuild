import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import formReducer from './redux/formSlice';
import rootSaga from './redux/Saga';
import App from './App';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: { form: formReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
export type RootState = ReturnType<typeof store.getState>;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
