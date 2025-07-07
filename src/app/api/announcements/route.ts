import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// HTTP GET 요청을 처리하는 비동기 함수를 정의하고 내보냅니다.
// Next.js 앱 라우터에서는 `route.ts` 파일에 GET, POST 등의 이름으로 함수를 내보내면
// 해당 HTTP 메소드에 대한 API 엔드포인트가 생성됩니다.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchTerm = searchParams.get('search') || '';
  const categories = searchParams.getAll('category').map(Number);

  const limit = 15;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('notice')
    .select(`
      id,
      ai_summary_title,
      ai_summary_content,
      markdown_content,
      writer,
      publish_date,
      category,
      original_url,
      created_at,
      notice_images:notice_images!notice_images_notice_id_fkey(id,url,notice_id),
      notice_files:notice_files!notice_files_notice_id_fkey(id,filename,url,notice_id)
    `, { count: 'exact' })
    .eq('ignore_flag', false)
    .order('publish_date', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (searchTerm) {
    query = query.or(`ai_summary_title.ilike.%${searchTerm}%,ai_summary_content.ilike.%${searchTerm}%`);
  }
  if (categories.length > 0) {
    query = query.in('category', categories);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ message: 'Error fetching announcements' }, { status: 500 });
  }

  return NextResponse.json({
    announcements: data,
    total: count,
    has_more: (offset + (data?.length || 0)) < (count || 0),
  });
} 