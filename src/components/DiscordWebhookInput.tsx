import React, { useState } from 'react';
import { Input, Button, message } from 'antd';

function Title() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
      <img
        src="/svgs/discord-icon.svg"
        alt="Discord Icon"
        style={{ width: 48, height: 48, flexShrink: 0 }}
      />
      <h3 style={{ fontWeight: 'bold', margin: 0, fontSize: '1.35rem' }}>Discord Webhook이란?</h3>
    </div>
  );
}

function WebhookIntroBox() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: 40,
      minWidth: 340,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8,
    }}>
      <Title />
      <p style={{ color: '#555', fontSize: '0.98rem', lineHeight: 1.7, margin: 0 }}>
        Discord Webhook을 등록하면 새로운 공지사항이 올라올 때마다<br />
        해당 URL로 실시간 알림을 받아볼 수 있습니다.<br />
        <br />
        <b>Webhook 등록 방법:</b><br />
        1. <b>디스코드 서버</b>에서 원하는 <b>채널</b>에 들어가세요.<br />
        2. 채널 이름 옆 <b>톱니바퀴(설정)</b> 아이콘을 클릭하세요.<br />
        3. 왼쪽 메뉴에서 <b>통합 &gt; Webhook</b>을 선택하세요.<br />
        4. <b>Webhook 만들기</b>를 클릭한 뒤, <b>URL 복사</b> 버튼을 누르세요.<br />
        5. 복사한 Webhook URL을 오른쪽 입력창에 붙여넣고 저장하세요.<br />
        <br />
        이제 새로운 공지사항이 등록될 때마다 해당 채널로 자동 알림이 전송됩니다!
      </p>
    </div>
  );
}

function WebhookInputBox() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputStatus, setInputStatus] = useState<'error' | undefined>(undefined);
  const [messageApi, contextHolder] = message.useMessage();
  const [testLoading, setTestLoading] = useState(false);

  const showInputError = () => {
    setInputStatus('error');
    setTimeout(() => setInputStatus(undefined), 1500);
  };

  const handleSave = async () => {
    if (!url) {
      messageApi.warning('URL을 입력해주세요.');
      showInputError();
      return;
    }
    if (!/^https?:\/\//.test(url)) {
      messageApi.warning('URL은 http:// 또는 https://로 시작해야 합니다.');
      showInputError();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        messageApi.success('Webhook URL이 저장되었습니다!');
        setUrl('');
      } else {
        messageApi.error('저장에 실패했습니다.');
      }
    } catch (e) {
      messageApi.error('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 테스트 메시지 전송
  const handleTest = async () => {
    if (!url) {
      messageApi.warning('먼저 Webhook URL을 입력하세요.');
      showInputError();
      return;
    }
    if (!/^https?:\/\//.test(url)) {
      messageApi.warning('URL은 http:// 또는 https://로 시작해야 합니다.');
      showInputError();
      return;
    }
    setTestLoading(true);
    try {
      const markdownContent = [
        '**[테스트] Webhook이 정상적으로 동작하는지 확인합니다!**',
        '',
        '[공지 웹사이트 바로가기](https://computer.cnu.ac.kr)',
        '',
        '```java',
        'public class Main {',
        '    public static void main(String[] args) {',
        '        System.out.println("Hello, World!");',
        '    }',
        '}',
        '```',
      ].join('\n');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdownContent }),
      });
      if (res.ok) {
        messageApi.success('테스트 메시지가 전송되었습니다!');
      } else {
        messageApi.error('테스트 메시지 전송에 실패했습니다.');
      }
    } catch (e) {
      messageApi.error('테스트 메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: 40,
        minWidth: 400,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 12 }}>Discord Webhook URL 등록</h3>
        <Input
          placeholder="Discord Webhook URL을 입력하세요"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ marginBottom: 12 }}
          disabled={loading || testLoading}
          status={inputStatus}
        />
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <Button type="primary" onClick={handleSave} loading={loading}>
            저장
          </Button>
          <Button onClick={handleTest} loading={testLoading} disabled={loading}>
            테스트 메시지 보내기
          </Button>
        </div>
        <div style={{ color: '#888', fontSize: '0.95rem', marginTop: 4 }}>
          <span>테스트 메시지는 입력한 Webhook URL로 실제로 전송됩니다.<br />
          Discord 채널에서 정상적으로 메시지가 도착하는지 꼭 확인해 보세요.</span>
        </div>
        <div style={{ color: '#bbb', fontSize: '0.88rem', marginTop: 12, lineHeight: 1.6 }}>
          입력한 Webhook URL은 DB에 저장되며, 사용되지 않는 Webhook은 비활성화되어 URL을 새로 발급받아야 합니다.<br />
          비활성화된 Webhook을 다시 활성화하는 것은 지원하지 않습니다.
        </div>
      </div>
    </>
  );
}

const DiscordWebhookInput: React.FC = () => {
  return (
    <div style={{
      maxWidth: 1300,
      margin: '32px auto',
      display: 'flex',
      gap: 48,
      justifyContent: 'center',
      alignItems: 'stretch',
      flexWrap: 'wrap',
    }}>
      <WebhookIntroBox />
      <WebhookInputBox />
    </div>
  );
};

export default DiscordWebhookInput; 