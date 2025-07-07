import { useState, useEffect, useCallback } from 'react';
import { Announcement } from '@/types';

export const useAnnouncements = (debouncedSearchTerm: string, selectedCategories: number[]) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = useCallback(async (pageNum: number, search: string, categories: number[]) => {
    if (pageNum === 1) {
      setIsLoading(true);
    }
    try {
      const categoryParams = categories.map(cat => `category=${cat}`).join('&');
      const response = await fetch(`/api/announcements?page=${pageNum}&search=${encodeURIComponent(search)}&${categoryParams}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      const newAnnouncements = (data.announcements || []).map((item: any) => ({
        ...item,
        images: item.notice_images ?? [],
        files: item.notice_files ?? [],
      }));

      setAnnouncements(prev => (pageNum === 1 ? newAnnouncements : [...prev, ...newAnnouncements]));
      setHasMore(data.has_more);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setHasMore(false);
    } finally {
      if (pageNum === 1) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchAnnouncements(1, debouncedSearchTerm, selectedCategories);
  }, [debouncedSearchTerm, selectedCategories, fetchAnnouncements]);

  const loadMoreAnnouncements = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnnouncements(nextPage, debouncedSearchTerm, selectedCategories);
  };

  return { announcements, isLoading, hasMore, loadMoreAnnouncements };
}; 