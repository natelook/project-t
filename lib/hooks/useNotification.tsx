import { useCallback, useEffect, useState } from 'react';

export default function useNotification() {
  const [isActive, setActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isActive)
      setTimeout(() => {
        setActive(false);
        setMessage('');
      }, 5000);
    return () => clearTimeout();
  }, [isActive]);

  const triggerNotification = useCallback((m: string) => {
    setMessage(m);
    setActive(true);
  }, []);

  return { isActive, message, triggerNotification };
}
