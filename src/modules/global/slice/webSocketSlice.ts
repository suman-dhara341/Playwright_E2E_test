// webSocketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebSocketState {
  connected: boolean;
  messages: string[];
  error: string | null;
}

const initialState: WebSocketState = {
  connected: false,
  messages: [],
  error: null,
};

const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    connectWebSocket: (state, _action: PayloadAction<{ EMP_ID: any; ORG_ID: any }>) => {
      state.connected = true;
    },
    disconnectWebSocket: (state) => {
      state.connected = false;
    },
    receiveMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
    webSocketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { connectWebSocket, disconnectWebSocket, receiveMessage, webSocketError } = webSocketSlice.actions;
export default webSocketSlice.reducer;
