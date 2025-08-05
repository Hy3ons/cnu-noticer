'use client';

import { useEffect, useState } from 'react';
import { Schedule, Announcement } from '@/types';
import { differenceInCalendarDays, format } from 'date-fns';
import { Card, List, Spin, Tag, Typography, Skeleton } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ScheduleViewProps {
  onAnnouncementClick: (announcement: Announcement) => void;
}

const CountdownTimer: React.FC<{ endDate: string }> = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    if (difference > 0) {
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <Tag color="red">마감</Tag>;
  }

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <Tag color="red">
      {`${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)} 남음`}
    </Tag>
  );
};

const getDday = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  const diff = differenceInCalendarDays(end, today);

  if (diff < 0) {
    return <Tag color="red">마감</Tag>;
  }
  if (diff === 0) {
    return <CountdownTimer endDate={endDate} />;
  }
  if (diff <= 7) {
    return <Tag color="gold">D-{diff}</Tag>;
  }
  if (diff > 365) {
    return <Tag>무기한</Tag>;
  }
  return <Tag color="green">D-{diff}</Tag>;
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ onAnnouncementClick }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/schedules');
        const data: Schedule[] = await response.json();
        const sortedData = data.sort(
          (a, b) => new Date(a.end).getTime() - new Date(b.end).getTime()
        );
        setSchedules(sortedData);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <Card
      title={
        <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          주요 마감일정
        </h2>
      }
      style={{ width: '100%', maxWidth: 1300, marginTop: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }}
    >
      <div id="scheduleScrollableDiv" className="custom-scrollbar" style={{ height: 400, overflow: 'auto' }}>
        {loading ? (
          <List
            itemLayout="horizontal"
            dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            style={{ padding: 0}}
            renderItem={(index) => (
              <List.Item
                style={{ padding: '16px 12px' ,}}
                actions={[<Skeleton.Button key="action" active size="small" style={{ width: 100, height: 24 }} />]}
              >
                <List.Item.Meta
                  title={
                    <div style={{ height: 24 }}>
                      <Skeleton active paragraph={{ rows: 0 }} title={{ width: '50%' }} />
                    </div>
                  }
                  description={
                    <div style={{ height: 20 }}>
                      <Skeleton active paragraph={{ rows: 0 }} title={{ width: '60%' }} />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={schedules}
            style={{ padding: 0 }}
            renderItem={(item) => (
              <List.Item
                style={{ padding: '12px 16px', cursor: item.notice ? 'pointer' : 'default' }}
                actions={[getDday(item.end)]}
                onClick={() => item.notice && onAnnouncementClick(item.notice)}
              >
                <List.Item.Meta
                  title={
                    <span
                      style={{
                        fontSize: '15px',
                        color: '#222',
                        textDecoration: 'none',
                        cursor: item.notice ? 'pointer' : 'default',
                      }}
                      onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {item.title}
                    </span>
                  }
                  description={`${format(new Date(item.begin), 'yyyy.MM.dd')} ~ ${format(new Date(item.end), 'yyyy.MM.dd')}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default ScheduleView; 