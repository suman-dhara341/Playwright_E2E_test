import { Middleware } from '@reduxjs/toolkit';
import { connectWebSocket, disconnectWebSocket, receiveMessage, webSocketError } from '../slice/webSocketSlice';

const webSocketMiddleware: Middleware = (storeAPI) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    if (connectWebSocket.match(action)) {
      const { EMP_ID, ORG_ID } = action.payload;
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(`wss://m3izorc9n2.execute-api.us-east-1.amazonaws.com/notify/?userId=${EMP_ID}&orgId=${ORG_ID}`);

        socket.onopen = () => {
          console.log('WebSocket connected');
          console.log(new Date().getTime(),"Time")
        };

        socket.onmessage = (event) => {
          storeAPI.dispatch(receiveMessage(event.data));
        };

        socket.onerror = () => {
          storeAPI.dispatch(webSocketError('WebSocket error'));
        };

        socket.onclose = () => {
          console.log('WebSocket disconnected');
          console.log(new Date().getTime(),"Time")
          storeAPI.dispatch(disconnectWebSocket());
        };
      }
    }

    if (disconnectWebSocket.match(action) && socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    return next(action);
  };
};

export default webSocketMiddleware;
