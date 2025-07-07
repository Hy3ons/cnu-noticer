import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ message: 'URL이 필요합니다.' }, { status: 400 });
  }
  if (!/^https?:\/\//.test(url)) {
    return NextResponse.json({ message: 'URL은 http:// 또는 https://로 시작해야 합니다.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('webhooks')
    .insert([{ url, is_active: true }]);

  if (error) {
    console.error('Webhook 저장 오류:', error);
    return NextResponse.json({ message: '저장에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ message: '저장되었습니다.' });
} 