import { NotifcationColors } from '@lib/types';
import { useCallback, useEffect, useState } from 'react';

export default function useNotification() {
  const [isActive, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const [notificationColor, setNotificationColor] =
    useState<NotifcationColors>('primary');

  useEffect(() => {
    if (isActive)
      setTimeout(() => {
        setActive(false);
        setMessage('');
      }, 5000);
    return () => clearTimeout();
  }, [isActive]);

  const triggerNotification = useCallback(
    (m: string, color?: NotifcationColors) => {
      if (color) {
        setNotificationColor(color);
      }
      setMessage(m);
      setActive(true);
    },
    [],
  );

  return { isActive, message, triggerNotification, notificationColor };
}
