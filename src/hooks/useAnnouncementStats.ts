import { useState, useEffect } from 'react';

interface DailyStat {
  date: string;
  count: number;
  dateLabel: string;
}

interface StatsResponse {
  stats: DailyStat[];
  startDate: string;
  endDate: string;
}

export const useAnnouncementStats = () => {
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/announcements/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data: StatsResponse = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching announcement stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}; 