import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

const persistConfig = {
  key: "avatar",
  storage,
};

const initialState = {
  avatarImageUrl: null,
};

const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    setAvatarImageUrl: (state, action) => {
      state.avatarImageUrl = action.payload;
    },
  },
});

export const { setAvatarImageUrl } = avatarSlice.actions;

const persistedAvatarReducer = persistReducer(persistConfig, avatarSlice.reducer);

export default persistedAvatarReducer;
