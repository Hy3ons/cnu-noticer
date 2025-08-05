'use client';

import React from 'react';
import { List, Spin, Tag, Image, Skeleton } from 'antd';
import { PushpinOutlined, CalendarOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';

import { Announcement, categoryMapping } from '@/types';
import { useImportantAnnouncements } from '@/hooks/useImportantAnnouncements';

interface ImportantAnnouncementListProps {
  onAnnouncementClick: (announcement: Announcement) => void;
  readStatuses: { [key: string]: string };
  isMobile: boolean;
}

const ImportantAnnouncementList: React.FC<ImportantAnnouncementListProps> = React.memo(({ 
  onAnnouncementClick, 
  readStatuses, 
  isMobile 
}) => {
  const { 
    announcements: noticeAnnouncements, 
    hasMore: hasMoreNotice, 
    loadMore: loadMoreNotices,
    isLoading
  } = useImportantAnnouncements();

  const handleAnnouncementClick = React.useCallback((announcement: Announcement) => {
    onAnnouncementClick(announcement);
  }, [onAnnouncementClick]);

  return (
    <div
      className="layout-optimized"
      style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: '88px',
        marginTop: isMobile ? 24 : 0,
        flexBasis: isMobile ? '100%' : '40%',
        marginLeft: isMobile ? 0 : 32,
        minWidth: 0
      }}
    >
      <h2 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
        <PushpinOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
        주요 공지
      </h2>
      <div id="noticeScrollableDiv" className="custom-scrollbar infinite-scroll-container" style={{ height: 'calc(100vh - 160px)', overflow: 'auto' }}>
        {isLoading ? (
          <List
            itemLayout="horizontal"
            dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            renderItem={(index) => (
              <List.Item
                key={index}
                className="list-item-optimized"
                style={{ padding: '12px 0' }}
                extra={<Skeleton.Button key="tag" active size="small" className="skeleton-optimized" style={{ width: 60, height: 20 }} />}
              >
                <List.Item.Meta
                  title={
                    <div style={{ height: 20 }}>
                      <Skeleton active paragraph={{ rows: 0 }} title={{ width: '90%' }} className="skeleton-optimized" />
                    </div>
                  }
                  description={
                    <div style={{ height: 16 }}>
                      <Skeleton active paragraph={{ rows: 0 }} title={{ width: '50%' }} className="skeleton-optimized" />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <InfiniteScroll
            dataLength={noticeAnnouncements.length}
            next={loadMoreNotices}
            hasMore={hasMoreNotice}
            loader={<div style={{ textAlign: 'center', padding: '10px' }}><Spin /></div>}
            endMessage={<p style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}><b>더 이상 주요 공지가 없습니다.</b></p>}
            scrollableTarget="noticeScrollableDiv"
          >
            <List
              itemLayout="horizontal"
              dataSource={noticeAnnouncements}
              renderItem={(item: any) => {
                const isRead = !!readStatuses[item.id];
                return (
                  <List.Item
                    key={item.id}
                    className="list-item-optimized"
                    onClick={() => handleAnnouncementClick(item)}
                    style={{ cursor: 'pointer', padding: '12px 0' }}
                    extra={
                      item.category != null && categoryMapping[item.category] ? (
                        <Tag color={categoryMapping[item.category].color}>
                          {categoryMapping[item.category].name}
                        </Tag>
                      ) : null
                    }
                  >
                    <List.Item.Meta
                      title={
                        <a
                          className="hover-underline"
                          style={{
                            fontSize: '14px',
                            color: 'rgba(0, 0, 0, 0.85)',
                            textDecoration: 'none',
                            cursor: 'pointer',
                          }}
                          onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {item.ai_summary_title || item.title}
                          {isRead && (
                            <Image
                              src="/svgs/check-icon.svg"
                              alt="Read"
                              width={14}
                              height={14}
                              style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                marginLeft: '6px',
                                pointerEvents: 'none',
                              }}
                            />
                          )}
                        </a>
                      }
                      description={
                        <span
                          className="hover-underline"
                          style={{ fontSize: '12px', color: '#888', textDecoration: 'none', cursor: 'pointer' }}
                          onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          <CalendarOutlined style={{ marginRight: '6px' }} />
                          {dayjs(item.publish_date).format('YYYY-MM-DD')}
                        </span>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
});

ImportantAnnouncementList.displayName = 'ImportantAnnouncementList';

export default ImportantAnnouncementList; 