import { useState, useEffect, useCallback } from 'react';
import { Announcement } from '@/types';

export const useImportantAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = useCallback(async (pageNum: number) => {
    if (pageNum === 1) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(`/api/important-announcements?page=${pageNum}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const newNotices = (data.announcements || []).map((item: any) => ({
        ...item,
        images: item.notice_images ?? [],
        files: item.notice_files ?? [],
      }));
      
      setAnnouncements(prev => (pageNum === 1 ? newNotices : [...prev, ...newNotices]));
      setHasMore(newNotices.length > 0);
    } catch (error) {
      console.error('Error fetching important announcements:', error);
      setHasMore(false);
    } finally {
      if (pageNum === 1) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(1);
  }, [fetchAnnouncements]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnnouncements(nextPage);
  };

  return { announcements, hasMore, loadMore, isLoading };
}; 