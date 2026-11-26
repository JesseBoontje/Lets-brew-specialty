-- Lets Brew stap 1: account, passkeys, sync. Alle tabellen uit docs/infra-account-volgen.md,
-- plus challenges (eenmalig, 5 min) en records.synced_at (servertijd in microseconden,
-- zodat "wat is er sinds de vorige sync" niet afhangt van de klok van de telefoon).
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL UNIQUE,
  name TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','public')),
  ai_allowed INTEGER NOT NULL DEFAULT 0,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS passkeys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  public_key BLOB NOT NULL,
  sign_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS passkeys_user ON passkeys(user_id);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS challenges (
  challenge TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('register','login')),
  user_id TEXT,
  handle TEXT,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS records (
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('bean','brew','gear','recipe','dial')),
  id TEXT NOT NULL,
  data TEXT,
  shareable INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  photo_key TEXT,
  synced_at INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, kind, id)
);
CREATE INDEX IF NOT EXISTS records_user_updated ON records(user_id, updated_at);
CREATE INDEX IF NOT EXISTS records_user_synced ON records(user_id, synced_at);
CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT NOT NULL,
  followee_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted')),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (follower_id, followee_id)
);
CREATE INDEX IF NOT EXISTS follows_followee ON follows(followee_id);
CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, owner_id, kind, id)
);
CREATE INDEX IF NOT EXISTS likes_owner ON likes(owner_id);
CREATE TABLE IF NOT EXISTS blocks (
  user_id TEXT NOT NULL,
  blocked_id TEXT NOT NULL,
  PRIMARY KEY (user_id, blocked_id)
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  by_user TEXT NOT NULL,
  about_user TEXT NOT NULL,
  reason TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS ai_usage (
  user_id TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
