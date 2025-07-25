import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TabState {
  activeTab: string;
}

const initialState: TabState = {
  activeTab: 'spotlight',
};

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
