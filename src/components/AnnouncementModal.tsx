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
  const modalContentRef = React.useRef<HTMLDivElement>(null);
  
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

  // 이미지 프리뷰 줌 이벤트 발생 시 브라우저 휠(스크롤) 동작 차단
  useEffect(() => {
    const modalEl = modalContentRef.current;
    if (!modalEl) return;
    const handlePreviewWheel = (e: WheelEvent) => {
      if ((e.target as Element).closest?.('[class*="ant-image-preview"]')) {
        e.preventDefault();
      }
    };
    modalEl.addEventListener('wheel', handlePreviewWheel, { passive: false });
    return () => {
      modalEl.removeEventListener('wheel', handlePreviewWheel);
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
        ref={modalContentRef}
        style={{
          marginTop: `${modalMarginTop}px`,
          background: 'white',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          transform: 'translateZ(0)',
          overflow: 'hidden'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, paddingRight: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', wordBreak: 'keep-all' }}>
              {announcement.ai_summary_title || announcement.title}
            </h3>
            {announcement.category != null && categoryMapping[announcement.category] && (
                <Tag color={categoryMapping[announcement.category].color} style={{ margin: 0 }}>
                    {categoryMapping[announcement.category].name}
                </Tag>
            )}
          </div>
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
          <div style={{ 
            marginBottom: '24px', 
            padding: '12px 16px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            fontSize: '14px', 
            color: '#555',
            border: '1px solid #eaeaea'
          }}>
            <span style={{ display: 'flex', gap: '8px' }}>
              <strong style={{ color: '#333' }}>작성자:</strong> {announcement.writer}
            </span>
            <span style={{ color: '#ddd' }}>|</span>
            <span style={{ display: 'flex', gap: '8px' }}>
              <strong style={{ color: '#333' }}>작성일:</strong> {dayjs(announcement.publish_date).format('YYYY-MM-DD')}
            </span>
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h1: ({node, ...props}) => <h1 style={{ fontSize: '1.8em', fontWeight: 'bold', marginTop: '1.5em', marginBottom: '0.8em', borderBottom: '1px solid #eaeaea', paddingBottom: '0.3em' }} {...props} />,
            h2: ({node, ...props}) => <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginTop: '1.5em', marginBottom: '0.8em', borderBottom: '1px solid #eaeaea', paddingBottom: '0.3em' }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ fontSize: '1.25em', fontWeight: 'bold', marginTop: '1.5em', marginBottom: '0.8em' }} {...props} />,
            h4: ({node, ...props}) => <h4 style={{ fontSize: '1.1em', fontWeight: 'bold', marginTop: '1.5em', marginBottom: '0.8em' }} {...props} />,
            p: ({node, ...props}) => <p style={{ lineHeight: 1.7, marginTop: '1em', marginBottom: '1em' }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ listStyleType: 'disc', paddingLeft: '2em', marginTop: '1em', marginBottom: '1em' }} {...props} />,
            ol: ({node, ...props}) => <ol style={{ listStyleType: 'decimal', paddingLeft: '2em', marginTop: '1em', marginBottom: '1em' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginTop: '0.25em', marginBottom: '0.25em' }} {...props} />,
            blockquote: ({node, ...props}) => <blockquote style={{ margin: '1em 0', padding: '0.5em 1em', color: '#666', borderLeft: '4px solid #ddd', backgroundColor: '#f9f9f9', borderRadius: '4px' }} {...props} />,
            a: ({node, ...props}) => <a {...props} style={{ color: '#1677ff', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer" />,
            table: ({node, ...props}) => <table {...props} style={{ width: '100%', borderCollapse: 'collapse', margin: '1em 0' }} />,
            th: ({node, ...props}) => <th {...props} style={{ border: '1px solid #e0e0e0', padding: '10px 14px', textAlign: 'left', backgroundColor: '#f9f9f9', fontWeight: 'bold', fontSize: '90%' }} />,
            td: ({node, ...props}) => <td {...props} style={{ border: '1px solid #e0e0e0', padding: '10px 14px', textAlign: 'left', fontSize: '90%' }} />,
            img: ({node, ...props}) => <img {...props} style={{ maxWidth: '100%', borderRadius: '8px', display: 'block', margin: '1em auto' }} />,
            code: ({node, inline, ...props}: any) => inline 
              ? <code style={{ backgroundColor: '#f0f0f0', padding: '0.2em 0.4em', borderRadius: '3px', fontSize: '0.9em', fontFamily: 'monospace' }} {...props} />
              : <div style={{ backgroundColor: '#f6f8fa', padding: '1em', borderRadius: '6px', overflowX: 'auto', marginBottom: '1em' }}><code style={{ fontFamily: 'monospace', fontSize: '0.9em' }} {...props} /></div>,
          }}>
            {announcement.markdown_content}
          </ReactMarkdown>
          {(hasImages || hasFiles) && <Divider />}
          {hasImages && (
            <div style={{marginTop: '24px'}}>
              <strong style={{fontSize: '16px'}}>첨부 이미지</strong>
              <div style={{marginTop: '16px'}}>
                <Image.PreviewGroup preview={{ zIndex: 10000, getContainer: () => modalContentRef.current || document.body }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                    {announcement.images.map((image) => (
                      image.id && <Image
                        key={image.id}
                        src={`/api/image-proxy?url=${encodeURIComponent(image.url)}`}
                        alt="첨부 이미지"
                        style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #f0f0f0', width: '100%', height: '150px' }}
                      />
                    ))}
                  </div>
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