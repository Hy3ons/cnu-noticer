import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from('notice')
    .select(`
      id,
      title,
      created_at,
      writer,
      category,
      markdown_content,
      ai_summary_title,
      ai_summary_content,
      original_url,
      publish_date,
      notice_images:notice_images!notice_images_notice_id_fkey(id,url,notice_id),
      notice_files:notice_files!notice_files_notice_id_fkey(id,filename,url,notice_id)
    `, { count: 'exact' })
    .eq('is_notice', true)
    .eq('ignore_flag', false)
    .order('publish_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    // Supabase 416 에러(범위 초과)는 빈 배열 반환
    if (error.code === 'PGRST103') {
      return NextResponse.json({
        announcements: [],
        total: count ?? 0,
        has_more: false,
      });
    }
    console.error('Error fetching important announcements:', error);
    return NextResponse.json({ message: 'Error fetching important announcements' }, { status: 500 });
  }

  return NextResponse.json({
    announcements: data,
    total: count,
    has_more: (offset + (data?.length || 0)) < (count || 0),
  });
} 