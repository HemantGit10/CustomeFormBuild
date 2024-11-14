import { call, put, takeEvery } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosInstance';
import { fetchUserData } from '../slice/userSlice';

// Define the expected response type
interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields based on the API response
}

// Define the generator function type
function* fetchUserDataSaga(action: ReturnType<typeof fetchUserData.pending>) {
  try {
    // Define the response explicitly
    const response: { data: User } = yield call(axiosInstance.get, `/users/${action.meta.arg}`);
    yield put(fetchUserData.fulfilled(response.data, action.meta.arg, action.meta.requestId));
  } catch (error: any) {
    const errorMessage = error.response?.data || 'An error occurred';
    yield put(fetchUserData.rejected(errorMessage, action.meta.arg, action.meta.requestId));
  }
}

function* userSaga() {
  yield takeEvery(fetchUserData.pending.type, fetchUserDataSaga);
}

export default userSaga;
