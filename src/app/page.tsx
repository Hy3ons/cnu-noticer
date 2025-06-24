'use client';

import { useState } from 'react';
import { Layout } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import { Announcement } from '@/types';
import AppHeader from '@/components/AppHeader';
import AnnouncementView from '@/components/AnnouncementView';
import AnnouncementModal from '@/components/AnnouncementModal';
import AppFooter from '@/components/AppFooter';
import { useReadStatus } from '@/hooks/useReadStatus';

dayjs.locale('ko');

const { Content } = Layout;

const Home: React.FC = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { readStatuses, markAsRead } = useReadStatus();

  const showModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    if (selectedAnnouncement) {
      markAsRead(selectedAnnouncement.id);
    }
    setIsModalVisible(false);
    setSelectedAnnouncement(null);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppHeader />
      <Content style={{ padding: '88px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AnnouncementView
          onAnnouncementClick={showModal}
          readStatuses={readStatuses}
        />
        <div style={{
          width: '100%',
          maxWidth: '1300px',
          marginTop: '24px',
          padding: '24px',
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '1.2rem' }}>🚀 Discord 알림봇 출시 예정!</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#555' }}>
            새로운 공지사항을 놓치지 않고 실시간으로 받아보고 싶으신가요? <br />
            곧 출시될 Discord 봇을 이용해 보세요! 가장 빠르고 정확하게 학과 공지를 전달해 드립니다.
          </p>
        </div>
        <AppFooter />
      </Content>
      <AnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isModalVisible}
        onClose={handleCancel}
      />
    </Layout>
  );
};

export default Home;
