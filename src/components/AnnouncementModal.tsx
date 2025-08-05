'use client';

import { Tag, List, Image, Divider, Button } from 'antd';
import { ExportOutlined, CloseOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { Announcement, categoryMapping } from '@/types';

interface AnnouncementModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, isOpen, onClose }) => {
  const hasImages = announcement?.images?.some(img => img.id);
  const hasFiles = announcement?.files?.some(file => file.id);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // 현재 스크롤 위치 저장
      setScrollY(window.scrollY);
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 스크롤 이벤트 전파 차단
  const scrollRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  if (!isOpen || !announcement) return null;

  // 동적으로 marginTop 계산
  const modalMarginTop = Math.max(0, scrollY);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        transform: 'translateZ(0)',
        willChange: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          marginTop: `${modalMarginTop}px`,
          background: 'white',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
            {announcement.ai_summary_title || announcement.title}
          </h3>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{ border: 'none', padding: '4px' }}
          />
        </div>

        {/* 내용 */}
        <div
          ref={scrollRef}
          className="prose custom-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 40px',
            maxHeight: 'calc(90vh - 120px)'
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ marginRight: '16px' }}><strong>작성자:</strong> {announcement.writer}</span>
              <span><strong>작성일:</strong> {dayjs(announcement.publish_date).format('YYYY-MM-DD')}</span>
            </div>
            {announcement.category != null && categoryMapping[announcement.category] && (
                <Tag color={categoryMapping[announcement.category].color}>
                    {categoryMapping[announcement.category].name}
                </Tag>
            )}
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            table: ({node, ...props}) => <table {...props} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }} />,
            th: ({node, ...props}) => <th {...props} style={{ border: '1px solid #e0e0e0', padding: '10px 14px', textAlign: 'left', backgroundColor: '#f9f9f9', fontWeight: 'bold', fontSize: '85%' }} />,
            td: ({node, ...props}) => <td {...props} style={{ border: '1px solid #e0e0e0', padding: '10px 14px', textAlign: 'left', fontSize: '85%' }} />,
          }}>
            {announcement.markdown_content}
          </ReactMarkdown>
          {(hasImages || hasFiles) && <Divider />}
          {hasImages && (
            <div style={{marginTop: '24px'}}>
              <strong style={{fontSize: '16px'}}>첨부 이미지</strong>
              <div style={{marginTop: '16px'}}>
                <Image.PreviewGroup>
                  {announcement.images.map((image) => (
                    image.id && <Image
                      key={image.id}
                      width={150}
                      src={`/api/image-proxy?url=${encodeURIComponent(image.url)}`}
                      alt="첨부 이미지"
                      style={{ marginRight: '10px', marginBottom: '10px' }}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>
          )}
          {hasFiles && (
            <div style={{marginTop: '24px'}}>
              <strong style={{fontSize: '16px'}}>첨부파일</strong>
              <List
                bordered
                dataSource={announcement.files.filter((file) => file.id)}
                renderItem={(file) => (
                  <List.Item>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                  </List.Item>
                )}
                style={{marginTop: '16px'}}
              />
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {announcement.original_url && (
            <Button
              href={announcement.original_url}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExportOutlined />}
            >
              원본글 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal; 