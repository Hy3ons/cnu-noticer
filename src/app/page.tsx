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
import ScheduleView from '@/components/ScheduleView';
import DiscordWebhookInput from '@/components/DiscordWebhookInput';
import DailyStatsChart from '@/components/DailyStatsChart';

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
        <ScheduleView onAnnouncementClick={showModal} />
        <DailyStatsChart />
        <DiscordWebhookInput />
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
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '1.2rem' }}>🛰️ 웹훅(Webhook) 기능 출시 예정!</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#555' }}>
            새로운 공지사항이 올라올 때마다 지정된 URL로 POST 요청을 날리는 서비스를 준비중입니다. <br />
            여러분의 서비스와 연동하여 자동화된 워크플로우를 구축해 보세요.
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
