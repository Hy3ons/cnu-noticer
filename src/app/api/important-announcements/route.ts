import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 15;
    const offset = (page - 1) * limit;

    const client = await pool.connect();

    const query = `
      SELECT 
        n.id, 
        n.title,
        n.created_at,
        n.writer,
        n.category,
        n.markdown_content,
        n.ai_summary_title,
        n.ai_summary_content,
        n.original_url,
        json_agg(DISTINCT jsonb_build_object('id', ni.id, 'url', ni.url)) FILTER (WHERE ni.id IS NOT NULL) AS images,
        json_agg(DISTINCT jsonb_build_object('id', nf.id, 'filename', nf.filename, 'url', nf.url)) FILTER (WHERE nf.id IS NOT NULL) AS files
      FROM notice n
      LEFT JOIN notice_images ni ON n.id = ni.notice_id
      LEFT JOIN notice_files nf ON n.id = nf.notice_id
      WHERE n.is_notice = true AND n.ignore_flag = false
      GROUP BY n.id
      ORDER BY n.created_at DESC
      LIMIT $1 OFFSET $2;
    `;

    const result = await client.query(query, [limit, offset]);
    client.release();

    return NextResponse.json({ announcements: result.rows });
  } catch (error) {
    console.error('Error fetching important announcements:', error);
    return NextResponse.json({ message: 'Error fetching important announcements' }, { status: 500 });
  }
} 