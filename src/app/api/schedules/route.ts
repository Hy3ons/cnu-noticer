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
    const {
      notice_id_alias, notice_title, notice_created_at, notice_writer,
      notice_category, notice_markdown_content, notice_ai_summary_title,
      notice_ai_summary_content, notice_original_url, notice_publish_date,
      images, files, ...scheduleData
    } = row;

    const notice: Announcement | null = notice_id_alias ? {
      id: notice_id_alias,
      title: notice_title,
      ai_summary_title: notice_ai_summary_title,
      ai_summary_content: notice_ai_summary_content,
      markdown_content: notice_markdown_content,
      writer: notice_writer,
      created_at: notice_created_at,
      publish_date: notice_publish_date,
      category: notice_category,
      original_url: notice_original_url,
      images: images && images[0] !== null ? images : [],
      files: files && files[0] !== null ? files : [],
    } : null;

    return {
      ...scheduleData,
      notice
    };
  });

  return NextResponse.json(schedules);
} 