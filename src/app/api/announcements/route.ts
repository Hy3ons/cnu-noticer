import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

  let client;
  try {
    client = await pool.connect();

    const queryParams: (string | number | number[])[] = [];
    let whereClauses = [`n.ignore_flag = false`];

    if (searchTerm) {
      queryParams.push(`%${searchTerm}%`);
      whereClauses.push(`(n.ai_summary_title ILIKE $${queryParams.length} OR n.ai_summary_content ILIKE $${queryParams.length})`);
    }

    if (categories.length > 0) {
      queryParams.push(categories);
      whereClauses.push(`n.category = ANY($${queryParams.length}::int[])`);
    }

    const whereQuery = `WHERE ${whereClauses.join(' AND ')}`;

    const countQuery = `SELECT COUNT(*) FROM notice n ${whereQuery}`;
    const countResult = await client.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count, 10);

    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT
        n.id,
        n.ai_summary_title,
        n.ai_summary_content,
        n.markdown_content,
        n.writer,
        n.publish_date,
        n.category,
        n.original_url,
        n.created_at,
        json_agg(DISTINCT jsonb_build_object('id', ni.id, 'url', ni.url)) FILTER (WHERE ni.id IS NOT NULL) AS images,
        json_agg(DISTINCT jsonb_build_object('id', nf.id, 'filename', nf.filename, 'url', nf.url)) FILTER (WHERE nf.id IS NOT NULL) AS files
      FROM notice n
      LEFT JOIN notice_images ni ON n.id = ni.notice_id
      LEFT JOIN notice_files nf ON n.id = nf.notice_id
      ${whereQuery}
      GROUP BY n.id
      ORDER BY n.created_at DESC
      LIMIT $${queryParams.length - 1}
      OFFSET $${queryParams.length}
    `;

    const dataResult = await client.query(dataQuery, queryParams);

    return NextResponse.json({
      announcements: dataResult.rows,
      total: total,
      has_more: offset + dataResult.rows.length < total,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ message: 'Error fetching announcements' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
} 