CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX login_logs_user_id_idx ON login_logs(user_id);
CREATE INDEX login_logs_created_at_idx ON login_logs(created_at);

-- 외래 키 제약 조건 추가
ALTER TABLE login_logs 
  ADD CONSTRAINT fk_login_logs_user 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

-- 이전 버전이 있다면 삭제
DROP TABLE IF EXISTS old_login_logs; 