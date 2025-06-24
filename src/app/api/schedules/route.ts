import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Schedule, Announcement } from '@/types';

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT
        s.id,
        s.title,
        s.description,
        s.begin,
        s."end",
        s.is_ignored,
        s.created_at,
        s.notice_id,
        n.id as notice_id_alias,
        n.title as notice_title,
        n.created_at as notice_created_at,
        n.writer as notice_writer,
        n.category as notice_category,
        n.markdown_content as notice_markdown_content,
        n.ai_summary_title as notice_ai_summary_title,
        n.ai_summary_content as notice_ai_summary_content,
        n.original_url as notice_original_url,
        n.publish_date as notice_publish_date,
        json_agg(DISTINCT jsonb_build_object('id', ni.id, 'url', ni.url)) FILTER (WHERE ni.id IS NOT NULL) AS images,
        json_agg(DISTINCT jsonb_build_object('id', nf.id, 'filename', nf.filename, 'url', nf.url)) FILTER (WHERE nf.id IS NOT NULL) AS files
      FROM schedules s
      LEFT JOIN notice n ON s.notice_id = n.id
      LEFT JOIN notice_images ni ON n.id = ni.notice_id
      LEFT JOIN notice_files nf ON n.id = nf.notice_id
      WHERE s.is_ignored = false AND s."end" > NOW()
      GROUP BY s.id, n.id
      ORDER BY s."end" ASC;
    `;
    const result = await client.query(query);

    const schedules = result.rows.map(row => {
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
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ message: 'Error fetching schedules' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
} 