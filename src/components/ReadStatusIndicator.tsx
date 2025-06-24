'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import Image from 'next/image';
import dayjs from 'dayjs';

interface ReadStatusIndicatorProps {
  announcementId: number | string;
  showTime?: boolean;
  readStatuses: { [key: string]: string };
}

const formatTime = (isoString: string): string => {
  const now = dayjs();
  const readTime = dayjs(isoString);
  const diffSeconds = now.diff(readTime, 'second');

  if (diffSeconds < 1) return `방금`;
  if (diffSeconds <= 10) return `${diffSeconds}초 전`;
  if (diffSeconds < 60) return `${Math.floor(diffSeconds / 10) * 10}초 전`;
  
  const diffMinutes = now.diff(readTime, 'minute');
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  
  const diffHours = now.diff(readTime, 'hour');
  if (diffHours < 24) return `${diffHours}시간 전`;
  
  const diffDays = now.diff(readTime, 'day');
  if (diffDays < 30) return `${diffDays}일 전`;
  
  const diffMonths = now.diff(readTime, 'month');
  return `${diffMonths}달 전`;
};

export const ReadStatusIndicator: React.FC<ReadStatusIndicatorProps> = ({
  announcementId,
  showTime = true,
  readStatuses,
}) => {
  const isoString = readStatuses[announcementId];
  const [displayText, setDisplayText] = useState(() => (isoString ? formatTime(isoString) : ''));

  useEffect(() => {
    if (!isoString) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleUpdate = () => {
      setDisplayText(formatTime(isoString));

      const diffSeconds = dayjs().diff(dayjs(isoString), 'second');
      
      let interval;
      if (diffSeconds < 10) {
        interval = 1000; // 1초마다
      } else if (diffSeconds < 60) {
        const secondsUntilNextTen = 10 - (diffSeconds % 10);
        interval = (secondsUntilNextTen || 10) * 1000;
      } else if (diffSeconds < 3600) {
        const secondsUntilNextMinute = 60 - (diffSeconds % 60);
        interval = (secondsUntilNextMinute || 60) * 1000;
      } else if (diffSeconds < 86400) {
        const secondsUntilNextHour = 3600 - (diffSeconds % 3600);
        interval = (secondsUntilNextHour || 3600) * 1000;
      } else {
        // 1일 이상 지나면 1시간마다 업데이트
        interval = 3600000;
      }
      
      timeoutId = setTimeout(scheduleUpdate, interval);
    };

    scheduleUpdate();

    return () => clearTimeout(timeoutId);
  }, [isoString]);

  if (!isoString) {
    return null;
  }

  return (
    <Tag color="green" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
      <Image
        src="/svgs/check-icon.svg"
        alt="Read"
        width={14}
        height={14}
        style={{ marginRight: '4px' }}
      />
      {showTime ? `${displayText} 읽음` : '읽음'}
    </Tag>
  );
}; 