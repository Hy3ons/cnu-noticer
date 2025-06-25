import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ message: 'URL이 필요합니다.' }, { status: 400 });
  }
  let client;
  try {
    client = await pool.connect();
    await client.query('INSERT INTO webhooks (url, is_active) VALUES ($1, $2)', [url, true]);
    return NextResponse.json({ message: '저장되었습니다.' });
  } catch (error) {
    console.error('Webhook 저장 오류:', error);
    return NextResponse.json({ message: '저장에 실패했습니다.' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
} 