import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// TypeScript에서 global 객체에 커스텀 속성을 추가하기 위한 타입 확장
declare global {
  // eslint-disable-next-line no-var
  var pool: Pool | undefined;
}

// globalThis.pool이 없으면 새로운 Pool을 생성하고, 있으면 기존 Pool을 사용합니다.
// 이렇게 하면 개발 중 핫 리로드 시에도 새로운 Pool이 생성되지 않습니다.
const pool = globalThis.pool || new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  max: 10, // 동시에 열 수 있는 최대 클라이언트 수 (기본값은 10)
  idleTimeoutMillis: 30000, // 유휴 클라이언트가 풀에 남아있는 시간 (ms)
  connectionTimeoutMillis: 2000, // 연결 시도 타임아웃 (ms)
});

// 개발 환경에서는 globalThis.pool에 현재 pool을 할당합니다.
if (process.env.NODE_ENV !== 'production') {
  globalThis.pool = pool;
}

export default pool; 