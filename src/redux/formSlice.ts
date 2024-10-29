import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormConfig } from '../types/formTypes';

interface FormState {
  config: FormConfig | null;
}

const initialState: FormState = {
  config: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormConfig(state, action: PayloadAction<FormConfig>) {
      state.config = action.payload;
    },
  },
});

export const { setFormConfig } = formSlice.actions;
export default formSlice.reducer;
