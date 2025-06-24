'use client';

import { useState, useEffect } from 'react';
import { Layout, Tooltip, Popconfirm, Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [isCnuHovered, setIsCnuHovered] = useState(false);
  const [isCseHovered, setIsCseHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // 초기값 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClearLocalStorage = () => {
    localStorage.removeItem('readAnnouncements');
    message.success('읽음 기록이 모두 초기화되었습니다.');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Header style={{ 
      backgroundColor: '#002C5F', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center',
      position: 'fixed',
      zIndex: 1000,
      width: '100%'
    }}>
      <a
        href="https://plus.cnu.ac.kr/html/kr/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        onMouseEnter={() => setIsCnuHovered(true)}
        onMouseLeave={() => setIsCnuHovered(false)}
      >
        <img src="/images/logo-cnu-w.png" alt="CNU Logo" style={{ height: '40px', marginRight: '12px' }} />
        <div style={{ 
          color: 'white', 
          fontSize: isMobile ? '12px' : '14px', 
          marginRight: '10px', 
          borderRight: '1px solid #3E5B7D', 
          paddingRight: '10px', 
          height: '20px', 
          lineHeight: '20px',
          textDecoration: isCnuHovered ? 'underline' : 'none',
          whiteSpace: 'nowrap',
        }}>
          충남대학교
        </div>
      </a>
      <a
        href="https://computer.cnu.ac.kr/computer/index.do"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
        onMouseEnter={() => setIsCseHovered(true)}
        onMouseLeave={() => setIsCseHovered(false)}
      >
        <div style={{ 
          color: 'white', 
          fontSize: isMobile ? '16px' : '18px', 
          fontWeight: 'bold',
          textDecoration: isCseHovered ? 'underline' : 'none',
          whiteSpace: 'nowrap',
        }}>
          컴퓨터융합학부
        </div>
      </a>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Tooltip title="모든 읽음 기록 초기화">
          <Popconfirm
            title="읽음 기록 초기화"
            description="정말로 모든 읽음 기록을 초기화하시겠습니까?"
            onConfirm={handleClearLocalStorage}
            okText="예"
            cancelText="아니요"
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: 'white', fontSize: '20px' }} />}
              style={{ padding: 0, height: 'auto', border: 'none' }}
            />
          </Popconfirm>
        </Tooltip>
        
        <Tooltip title="제작자의 깃허브로 이동">
          <a href="https://github.com/Hy3ons" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/images/logo-github-w.png" alt="GitHub Logo" style={{ height: '32px' }} />
          </a>
        </Tooltip>
      </div>
    </Header>
  );
};

export default AppHeader; 