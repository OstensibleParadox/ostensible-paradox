CREATE TABLE IF NOT EXISTS room_entries (
  id TEXT PRIMARY KEY,
  slug TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('shout', 'post')),
  title TEXT,
  summary TEXT,
  body_markdown TEXT NOT NULL,
  body_text TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  author_email TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_room_entries_kind_created
  ON room_entries (kind, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_room_entries_author_created
  ON room_entries (author_email, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_room_entries_slug
  ON room_entries (slug)
  WHERE kind = 'post' AND slug IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS room_rate_limits (
  key TEXT PRIMARY KEY,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL
);
