'use client';

import { Layout } from 'antd';

const { Header } = Layout;

const AppHeader: React.FC = () => {
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
      <a href="https://plus.cnu.ac.kr/html/kr/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/images/logo-cnu-w.png" alt="CNU Logo" style={{ height: '40px', marginRight: '20px' }} />
        <div style={{ color: 'white', fontSize: '14px', marginRight: '10px', borderRight: '1px solid #3E5B7D', paddingRight: '10px', height: '20px', lineHeight: '20px'}}>
          충남대학교
        </div>
      </a>
      <a href="https://computer.cnu.ac.kr/computer/index.do" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          컴퓨터융합학부
        </div>
      </a>


      <a href="https://github.com/Hy3ons" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginLeft: 'auto'  }}>
        <img src="/images/logo-github-w.png" alt="GitHub Logo" style={{ height: '32px' }} />
      </a>
    </Header>
  );
};

export default AppHeader; 