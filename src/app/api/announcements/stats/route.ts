import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import dayjs from 'dayjs';

export async function GET(request: NextRequest) {
  try {
    // 오늘부터 30일 전까지의 날짜 범위 계산
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');

    // Supabase에서 일별 공지사항 개수 조회
    const { data, error } = await supabase
      .from('notice')
      .select('publish_date')
      .eq('ignore_flag', false)
      .gte('publish_date', startDate)
      .lte('publish_date', endDate)
      .order('publish_date', { ascending: true });

    if (error) {
      console.error('Error fetching announcement stats:', error);
      return NextResponse.json({ message: 'Error fetching announcement stats' }, { status: 500 });
    }

    // 일별 통계 데이터 생성
    const dailyStats = new Map<string, number>();
    
    // 30일간의 모든 날짜를 초기화
    for (let i = 30; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      dailyStats.set(date, 0);
    }

    // 실제 데이터로 카운트 업데이트
    data?.forEach(item => {
      const date = dayjs(item.publish_date).format('YYYY-MM-DD');
      const currentCount = dailyStats.get(date) || 0;
      dailyStats.set(date, currentCount + 1);
    });

    // 배열 형태로 변환
    const statsArray = Array.from(dailyStats.entries()).map(([date, count]) => ({
      date,
      count,
      dateLabel: dayjs(date).format('MM/DD')
    }));

    return NextResponse.json({
      stats: statsArray,
      startDate,
      endDate
    });

  } catch (error) {
    console.error('Error in announcement stats API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 