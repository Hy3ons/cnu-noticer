'use client';

import { Card, Spin, Empty, Alert } from 'antd';
import { Column } from '@ant-design/charts';
import { useAnnouncementStats } from '@/hooks/useAnnouncementStats';
import { useEffect, useRef, useState } from 'react';

const DailyStatsChart: React.FC = () => {
  const { stats, isLoading, error } = useAnnouncementStats();
  const chartRef = useRef<any>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (chartRef.current && stats.length > 0) {
      chartRef.current.update();
    }
  }, [stats]);

  const displayStats = windowWidth <= 850 ? stats.slice(-10) : 
                      windowWidth <= 1100 ? stats.slice(-20) : stats;

  if (isLoading) {
    return (
      <Card 
        title="📊 일별 공지사항 통계" 
        style={{ 
          width: '100%', 
          maxWidth: '1300px', 
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        title="📊 일별 공지사항 통계" 
        style={{ 
          width: '100%', 
          maxWidth: '1300px', 
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <Alert
          message="오류 발생"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card 
        title="📊 일별 공지사항 통계" 
        style={{ 
          width: '100%', 
          maxWidth: '1300px', 
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <Empty description="통계 데이터가 없습니다." />
      </Card>
    );
  }

  const config = {
    data: displayStats,
    xField: 'dateLabel',
    yField: 'count',
    axis: {
      y: {
        title: '공지사항 개수',
      },
      x: {
        labelFontSize: 11,
        labelFormatter: (d: any) => d,
                 transform: [
           {
             type: 'rotate',
             optionalAngles: [0, 45],
             recoverWhenFailed: true,
           },
         ],
      },
    },
    meta: {
      count: {
        alias: '공지사항 개수',
        type: 'linear',
      },
    },
    columnStyle: {
      fill: '#1890ff',
      opacity: 0.5,
    },
    tooltip: {
      items: [
        (datum: any, index: number, data: any[], column: any) => ({
          color: '#1890ff',
          name: datum.dateLabel || '날짜',
          value: `${Number(datum.count) || 0}개`,
          custom1: '공지사항',
          custom2: datum.date || '',
        }),
      ],
    },
    interaction: {
      tooltip: {
        render: (event: any, { title, items }: any) => {
          if (items && items.length > 0) {
            const item = items[0];
            return `
              <div style="font-weight: bold; margin-bottom: 8px; color: #333;">${item.name}</div>
              <div style="color: #666;">${item.custom1}: ${item.value}</div>
              <div style="color: #999; font-size: 12px; margin-top: 4px;">${item.custom2}</div>
            `;
          }
          return '';
        }
      }
          },
    yAxis: {
      label: {
        formatter: (value: any) => `${Number(value) || 0}개`,
      },
    },

  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>일별 공지사항 통계</span>
        </div>
      }
      style={{ 
        width: '100%', 
        maxWidth: '1300px', 
        marginTop: '24px',
        marginBottom: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f0f0f0',
      }}
      styles={{
        header: {
          borderBottom: '2px solid #f0f0f0',
          padding: '16px 24px',
          backgroundColor: '#fafafa',
        },
        body: {
          padding: '24px',
        },
      }}
    >
      <div style={{ 
        height: '300px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <Column {...config} ref={chartRef} />
      </div>
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '14px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e8e8e8',
      }}>
        📈 최근 30일간의 일별 공지사항 개수를 보여줍니다. 
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          총 {stats.reduce((sum, item) => sum + item.count, 0)}개의 공지사항
        </span>이 있습니다.
      </div>
    </Card>
  );
};

export default DailyStatsChart; 