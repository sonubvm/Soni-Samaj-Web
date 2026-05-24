import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { formatApiError, prepareFamilyPayload } from '@/lib/validateFamily';
import { FamilyFormData } from '@/types/family';

interface FamilyState {
  loading: boolean;
  success: boolean;
  error: string | null;
  submittedId: string | null;
}

const initialState: FamilyState = {
  loading: false,
  success: false,
  error: null,
  submittedId: null,
};

export const submitFamily = createAsyncThunk(
  'family/submit',
  async (data: FamilyFormData, { rejectWithValue }) => {
    try {
      const payload = prepareFamilyPayload(data);
      const res = await api.post('/api/families', payload);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      const raw =
        error.response?.data?.message ||
        (error.response?.status === 409
          ? 'This mobile number is already registered. Duplicate registration is not allowed.'
          : 'Submission failed. Please fill all required fields.');
      return rejectWithValue(formatApiError(raw));
    }
  }
);

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    resetFamilyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.submittedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFamily.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitFamily.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submittedId = action.payload._id;
      })
      .addCase(submitFamily.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetFamilyState } = familySlice.actions;
export default familySlice.reducer;
