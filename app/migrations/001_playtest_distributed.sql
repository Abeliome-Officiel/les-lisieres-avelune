BEGIN;

CREATE TABLE IF NOT EXISTS playtest_sessions (
  id uuid PRIMARY KEY,
  code char(4) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','finished','archived')),
  game_version text NOT NULL,
  state_version integer NOT NULL DEFAULT 1 CHECK (state_version > 0),
  game_state jsonb NOT NULL,
  result text,
  finished_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS playtest_sessions_accessible_code_uq
  ON playtest_sessions (code) WHERE status <> 'archived';

CREATE TABLE IF NOT EXISTS playtest_events (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES playtest_sessions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  turn integer NOT NULL CHECK (turn >= 0),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  game_version text NOT NULL
);
CREATE INDEX IF NOT EXISTS playtest_events_session_created_idx ON playtest_events(session_id, created_at);

CREATE TABLE IF NOT EXISTS playtest_feedback (
  id uuid PRIMARY KEY,
  session_id uuid REFERENCES playtest_sessions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  category text NOT NULL,
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
  turn integer NOT NULL CHECK (turn >= 0),
  view text NOT NULL,
  game_version text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  mail_status text NOT NULL DEFAULT 'not_requested' CHECK (mail_status IN ('not_requested','pending','sent','failed')),
  mail_error text
);
CREATE INDEX IF NOT EXISTS playtest_feedback_session_created_idx ON playtest_feedback(session_id, created_at);

COMMIT;
