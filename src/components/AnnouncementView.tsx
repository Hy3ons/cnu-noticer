'use client';

import { useEffect, useState } from 'react';
import AnnouncementList from './AnnouncementList';
import ImportantAnnouncementList from './ImportantAnnouncementList';
import { Announcement } from '@/types';

interface AnnouncementViewProps {
  onAnnouncementClick: (announcement: Announcement) => void;
  readStatuses: { [key: string]: string };
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ onAnnouncementClick, readStatuses }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // 초기값 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 w-full max-w-[1300px]`}>
      <AnnouncementList 
        onAnnouncementClick={onAnnouncementClick}
        readStatuses={readStatuses}
        isMobile={isMobile}
      />
      <ImportantAnnouncementList 
        onAnnouncementClick={onAnnouncementClick}
        readStatuses={readStatuses}
        isMobile={isMobile}
      />
    </div>
  );
};

export default AnnouncementView; 