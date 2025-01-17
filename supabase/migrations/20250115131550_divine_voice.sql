/*
  # Create events table for calendar presentations

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `date` (date, not null)
      - `person_name` (text, not null)
      - `theme` (text, not null)
      - `description` (text)

  2. Security
    - Enable RLS on `events` table
    - Add policies for authenticated users to read all events
    - Add policies for authenticated users to insert their own events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  date date NOT NULL,
  person_name text NOT NULL,
  theme text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);