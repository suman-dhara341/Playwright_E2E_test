import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OnboardingState {
  status: boolean;
}

const initialState: OnboardingState = {
  status: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setOnboardingStatus(state, action: PayloadAction<boolean>) {
      state.status = action.payload;
    },
  },
});

export const { setOnboardingStatus } = onboardingSlice.actions;
export default onboardingSlice.reducer;
