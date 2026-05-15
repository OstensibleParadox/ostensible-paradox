CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  page_path TEXT NOT NULL,
  author_name TEXT,
  author_email TEXT,
  body_markdown TEXT NOT NULL,
  created_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_page
  ON comments (page_path, created_at ASC)
  WHERE deleted_at IS NULL;
