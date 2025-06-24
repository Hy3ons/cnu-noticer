import { useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const LOCAL_STORAGE_KEY = 'readAnnouncements';

interface ReadStatus {
  [key: string]: string; // { announcementId: ISO_timestamp }
}

const getReadStatuses = (): ReadStatus => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return {};
  }
};

const setReadStatuses = (statuses: ReadStatus) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statuses));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
};

export const useReadStatus = () => {
  const [readStatuses, setReadStatusesState] = useState<ReadStatus>(getReadStatuses());

  useEffect(() => {
    setReadStatusesState(getReadStatuses());

    const handleStorageChange = () => {
      setReadStatusesState(getReadStatuses());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const markAsRead = useCallback((announcementId: number | string) => {
    const newStatuses = { ...getReadStatuses(), [announcementId]: new Date().toISOString() };
    setReadStatuses(newStatuses);
    setReadStatusesState(newStatuses);
  }, []);

  const getRelativeReadTime = useCallback((announcementId: number | string): string | null => {
    const isoString = readStatuses[announcementId];
    if (!isoString) {
      return null;
    }
    return dayjs(isoString).fromNow();
  }, [readStatuses]);

  return { readStatuses, markAsRead, getRelativeReadTime };
}; 