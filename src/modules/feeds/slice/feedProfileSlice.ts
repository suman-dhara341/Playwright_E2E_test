import { createSlice } from '@reduxjs/toolkit';

const FeedProfileSlice = createSlice({
  name: 'feedProfile',
  initialState: {
    reportsTo: '',
  },
  reducers: {
    setReportsTo: (state, action) => {
      state.reportsTo = action.payload;
    },
  },
});

export const { setReportsTo } = FeedProfileSlice.actions;
export default FeedProfileSlice.reducer;
