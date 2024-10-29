import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchFormConfig } from '../api/formApi';
import { setFormConfig } from './formSlice';
import { FormConfig } from '../types/formTypes';

function* loadFormConfigSaga() {
  try {
    const config : FormConfig = yield call(fetchFormConfig);
    yield put(setFormConfig(config));
  } catch (error) {
    console.error('Error loading form config:', error);
  }
}

export default function* rootSaga() {
  yield takeEvery('form/loadFormConfig', loadFormConfigSaga);
}
