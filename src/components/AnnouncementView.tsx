'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input, Checkbox, List, Spin, Tag, Image } from 'antd';
import { SearchOutlined, BellOutlined, CalendarOutlined, PushpinOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import { useDebounce } from 'use-debounce';

import { Announcement, categoryMapping } from '@/types';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useImportantAnnouncements } from '@/hooks/useImportantAnnouncements';
import { ReadStatusIndicator } from './ReadStatusIndicator';

interface AnnouncementViewProps {
  onAnnouncementClick: (announcement: Announcement) => void;
  readStatuses: { [key: string]: string };
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ onAnnouncementClick, readStatuses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // 초기값 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { 
    announcements, 
    isLoading, 
    hasMore, 
    loadMoreAnnouncements 
  } = useAnnouncements(debouncedSearchTerm, selectedCategories);
  
  const { 
    announcements: noticeAnnouncements, 
    hasMore: hasMoreNotice, 
    loadMore: loadMoreNotices 
  } = useImportantAnnouncements();

  const handleCategoryChange = (checkedValues: any) => {
    setSelectedCategories(checkedValues);
  };
  
  const categoryOptions = useMemo(() => 
    Object.entries(categoryMapping).map(([key, { name }]) => ({ 
      label: name, 
      value: parseInt(key, 10) 
    })), []);

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 w-full max-w-[1300px]`}>
      <div
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
      
        <div id="scrollableDiv" className="custom-scrollbar" style={{ height: 'calc(100vh - 240px)', overflow: 'auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
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
                    onClick={() => onAnnouncementClick(item)}
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
      <div
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
        <div id="noticeScrollableDiv" className="custom-scrollbar" style={{ height: 'calc(100vh - 160px)', overflow: 'auto' }}>
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
                        onClick={() => onAnnouncementClick(item)}
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
        </div>
      </div>
    </div>
  );
};

export default AnnouncementView; 