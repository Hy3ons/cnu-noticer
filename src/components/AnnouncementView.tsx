'use client';

import { useState, useMemo } from 'react';
import { Input, Checkbox, List, Spin, Tag } from 'antd';
import { SearchOutlined, BellOutlined, CalendarOutlined, UserOutlined, PushpinOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import { useDebounce } from 'use-debounce';

import { Announcement, categoryMapping } from '@/types';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useImportantAnnouncements } from '@/hooks/useImportantAnnouncements';

interface AnnouncementViewProps {
  onAnnouncementClick: (announcement: Announcement) => void;
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ onAnnouncementClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

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
    <div style={{ display: 'flex', width: '100%', maxWidth: '1300px', gap: '24px' }}>
      <div style={{ flex: 3, background: '#fff', padding: '24px', borderRadius: '8px' }}>
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
                      title={<span style={{fontSize: '16px'}}>{item.ai_summary_title || item.title}</span>}
                      description={item.ai_summary_content}
                    />
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          )}
        </div>
      </div>
      <div style={{ flex: 2, background: '#fff', padding: '24px', borderRadius: '8px', position: 'sticky', top: '88px' }}>
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
                renderItem={(item: any) => (
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
                            title={<a style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)' }}>{item.ai_summary_title || item.title}</a>}
                            description={
                                <span style={{ fontSize: '12px', color: '#888' }}>
                                    <CalendarOutlined style={{ marginRight: '6px' }} />
                                    {dayjs(item.created_at).format('YYYY-MM-DD')}
                                </span>
                            }
                        />
                    </List.Item>
                )}
            />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementView; 