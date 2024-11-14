import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';


interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields as per the API response
}

// Define initial state
const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

// Define async thunk for fetching user data
export const fetchUserData = createAsyncThunk<User, string, { rejectValue: string }>(
  'user/fetchData',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<User>(`/users/${userId}`);
      return response.data; // Return response data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user data';
      });
  },
});

export default userSlice.reducer;
