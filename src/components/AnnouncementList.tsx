'use client';

import React, { useState, useMemo } from 'react';
import { Input, Checkbox, List, Spin, Tag, Skeleton } from 'antd';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from 'use-debounce';

import { Announcement, categoryMapping } from '@/types';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { ReadStatusIndicator } from './ReadStatusIndicator';

interface AnnouncementListProps {
  onAnnouncementClick: (announcement: Announcement) => void;
  readStatuses: { [key: string]: string };
  isMobile: boolean;
}

const AnnouncementList: React.FC<AnnouncementListProps> = React.memo(({ onAnnouncementClick, readStatuses, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { 
    announcements, 
    isLoading, 
    hasMore, 
    loadMoreAnnouncements 
  } = useAnnouncements(debouncedSearchTerm, selectedCategories);

  const handleCategoryChange = React.useCallback((checkedValues: any) => {
    setSelectedCategories(checkedValues);
  }, []);
  
  const categoryOptions = useMemo(() => 
    Object.entries(categoryMapping).map(([key, { name }]) => ({ 
      label: name, 
      value: parseInt(key, 10) 
    })), []);

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
        flexBasis: isMobile ? '100%' : '60%',
        minWidth: 0
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="검색어를 입력하세요..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
          allowClear
        />
        <Checkbox.Group
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoryChange}
        />
      </div>
    
      <div id="scrollableDiv" className="custom-scrollbar infinite-scroll-container" style={{ height: 'calc(100vh - 240px)', overflow: 'auto' }}>
        {isLoading ? (
          <List
            dataSource={[1, 2, 3, 4, 5, 6, 7, 8]}
            renderItem={(index) => (
              <List.Item
                key={index}
                className="list-item-optimized"
                style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}
                extra={<Skeleton.Button key="tag" active size="small" className="skeleton-optimized" style={{ width: 60, height: 20 }} />}
              >
                <List.Item.Meta
                  avatar={<Skeleton.Avatar active size="small" className="skeleton-optimized" />}
                  title={
                    <div style={{ height: 24 }}>
                      <Skeleton active paragraph={{ rows: 0 }} title={{ width: '80%' }} className="skeleton-optimized" />
                    </div>
                  }
                  description={
                    <div style={{ height: 20 }}>
                      <Skeleton active paragraph={{ rows: 0 }} title={{ width: '60%' }} className="skeleton-optimized" />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <InfiniteScroll
            dataLength={announcements.length}
            next={loadMoreAnnouncements}
            hasMore={hasMore}
            loader={<div style={{ textAlign: 'center', padding: '10px' }}><Spin /></div>}
            endMessage={<p style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}><b>더 이상 공지사항이 없습니다.</b></p>}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={announcements}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  className="list-item-optimized"
                  onClick={() => handleAnnouncementClick(item)}
                  style={{ cursor: 'pointer', padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}
                  extra={
                    item.category != null && categoryMapping[item.category] ? (
                      <Tag color={categoryMapping[item.category].color}>
                        {categoryMapping[item.category].name}
                      </Tag>
                    ) : null
                  }
                >
                  <List.Item.Meta
                    avatar={<BellOutlined style={{ fontSize: '20px', color: '#1890ff', paddingTop: '4px' }}/>} 
                    title={
                      <>
                        <span
                          className="hover-underline"
                          style={{
                            fontSize: '16px',
                            color: readStatuses[item.id] ? '#666' : '#222',
                            transition: 'color 0.2s',
                            textDecoration: 'none',
                            cursor: 'pointer',
                          }}
                          onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {item.ai_summary_title || item.title}
                        </span>
                        {' '}
                        <ReadStatusIndicator announcementId={item.id} showTime={true} readStatuses={readStatuses} />
                      </>
                    }
                    description={
                      <span
                        className="hover-underline"
                        style={{
                          fontSize: '12px',
                          color: '#888',
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                        onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        {item.ai_summary_content}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
});

AnnouncementList.displayName = 'AnnouncementList';

export default AnnouncementList; 