import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../../../firebase/firebase-config';

const NotificationListener = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
    });

    return () => unsubscribe();
  }, []);
  
  return null;
};

export default NotificationListener;
