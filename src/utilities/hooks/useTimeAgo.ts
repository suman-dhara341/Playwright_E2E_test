import { useState, useEffect } from "react";

export const useTimeAgo = (inputTimestamp?: number): string => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (typeof inputTimestamp !== "number" || isNaN(inputTimestamp) || inputTimestamp <= 0) {
      setTimeAgo("Invalid timestamp");
      return;
    }

    const timeInMillis = inputTimestamp < 1e12 ? inputTimestamp * 1000 : inputTimestamp;

    const calculateTimeAgo = () => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - timeInMillis) / 1000);
      const isFuture = diffInSeconds < 0;
      const abs = Math.abs(diffInSeconds);

      if (abs < 60) return isFuture ? `in ${abs}s` : `${abs}s ago`;
      if (abs < 3600) return isFuture ? `in ${Math.floor(abs / 60)}m` : `${Math.floor(abs / 60)}m ago`;
      if (abs < 86400) return isFuture ? `in ${Math.floor(abs / 3600)}h` : `${Math.floor(abs / 3600)}h ago`;
      if (abs < 604800) return isFuture ? `in ${Math.floor(abs / 86400)}d` : `${Math.floor(abs / 86400)}d ago`;
      if (abs < 2592000) return isFuture ? `in ${Math.floor(abs / 604800)}w` : `${Math.floor(abs / 604800)}w ago`;
      if (abs < 31536000) return isFuture ? `in ${Math.floor(abs / 2592000)}mo` : `${Math.floor(abs / 2592000)}mo ago`;

      return isFuture ? `in ${Math.floor(abs / 31536000)}y` : `${Math.floor(abs / 31536000)}y ago`;
    };

    setTimeAgo(calculateTimeAgo());

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    return () => clearInterval(interval);
  }, [inputTimestamp]);

  return timeAgo;
};
