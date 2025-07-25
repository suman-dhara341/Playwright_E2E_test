import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, disconnectWebSocket } from '../slice/webSocketSlice';
import Logo from "/images/logo3.png";

interface RootState {
  webSocket: {
    messages: string[];
  };
}

const WebSocketNotification: React.FC = () => {
  const dispatch = useDispatch();
  const ORG_ID: any = useSelector((state: any) => state.auth?.userData?.["custom:orgId"] || null);
  const EMP_ID: any = useSelector((state: any) => state.auth?.userData?.["custom:empId"] || null);

  const { messages } = useSelector((state: RootState) => state.webSocket);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const displayedMessages = useRef<Set<string>>(new Set());

  const startMessageInterval = () => {
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
    }

    messageIntervalRef.current = setInterval(() => {
      const message = JSON.stringify({
        messageTitle: 'Ping',
        messageBody: 'Sending a ping to keep the connection alive.',
      });
      console.log('Ping message sent:', message);
    }, 8 * 60000);
  };

  useEffect(() => {
    const showNotifications = () => {
      if (messages.length > 0) {
        messages.forEach((message: string) => {
          try {
            const parsedMessage = JSON.parse(message);
            const { messageTitle, messageBody } = parsedMessage;

            if (messageTitle === 'Ping') {
              return;
            }

            if (!displayedMessages.current.has(message)) {
              if (Notification.permission === 'granted') {
                new Notification(messageTitle, {
                  body: messageBody,
                  icon: Logo,
                });
                displayedMessages.current.add(message);
              } else {
                console.log('Notification permission not granted');
              }
            }
          } catch (error) {
            console.error('Failed to parse message:', message, error);
          }
        });
      }
    };

    showNotifications();
  }, [messages]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }
    };

    requestNotificationPermission();

    if (EMP_ID && ORG_ID) {
      dispatch(connectWebSocket({ ORG_ID, EMP_ID }));
      startMessageInterval();
    }

    return () => {
      dispatch(disconnectWebSocket());
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [dispatch, EMP_ID, ORG_ID]);

  return <></>;
};

export default WebSocketNotification;
