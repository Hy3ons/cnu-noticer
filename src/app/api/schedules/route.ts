import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { Schedule, Announcement } from '@/types';

export async function GET(request: NextRequest) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      notice:notice_id(
        id,
        title,
        ai_summary_title,
        ai_summary_content,
        markdown_content,
        writer,
        created_at,
        publish_date,
        category,
        original_url,
        notice_images:notice_images!notice_images_notice_id_fkey(id,url,notice_id),
        notice_files:notice_files!notice_files_notice_id_fkey(id,filename,url,notice_id)
      )
    `)
    .eq('is_ignored', false)
    .gt('end', now)
    .order('end', { ascending: true });

  if (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ message: 'Error fetching schedules' }, { status: 500 });
  }

  const schedules = data.map(row => {
    const { notice, ...scheduleData } = row;
    let mappedNotice: Announcement | null = null;
    if (notice) {
      mappedNotice = {
        ...notice,
        images: notice.notice_images && notice.notice_images[0] !== null ? notice.notice_images : [],
        files: notice.notice_files && notice.notice_files[0] !== null ? notice.notice_files : [],
      };
    }
    return {
      ...scheduleData,
      notice: mappedNotice,
    };
  });

  return NextResponse.json(schedules);
} 