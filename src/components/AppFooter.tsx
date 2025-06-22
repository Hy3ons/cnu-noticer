'use client';

import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ 
      textAlign: 'center', 
      backgroundColor: 'transparent', 
      color: '#888',
      fontSize: '12px',
      padding: '24px 0'
    }}>
      <p style={{ margin: 0, lineHeight: 1.8 }}>
        이 웹사이트는 2024년 7월 <a href="https://github.com/Hy3ons" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'underline' }}>Hy3ons</a>에 의해 제작되었습니다. <br />
        모든 공지사항의 내용은 원본 링크를 따르며, 요약된 내용은 AI에 의해 생성되어 실제와 다를 수 있습니다.<br />
        문의 및 버그 제보: <a href="mailto:hhs2003@o.cnu.ac.kr" style={{ color: '#888', textDecoration: 'underline' }}>hhs2003@o.cnu.ac.kr</a>
      </p>
    </Footer>
  );
};

export default AppFooter; 