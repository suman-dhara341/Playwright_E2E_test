// src/modules/global/slice/messageSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessagePayload } from "firebase/messaging";

// ✅ Export the type
export interface MessageState {
  messages: MessagePayload[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
