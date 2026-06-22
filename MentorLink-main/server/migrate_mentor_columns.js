/**
 * One-time migration: Adds `name` and `profile_picture` columns to the `mentor` table.
 * Run with: node server/migrate_mentor_columns.js <SUPABASE_SERVICE_ROLE_KEY>
 * 
 * Get your service role key from: Supabase Dashboard > Project Settings > API > service_role secret
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.argv[2];

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Usage: node server/migrate_mentor_columns.js <SUPABASE_SERVICE_ROLE_KEY>");
  console.error("Get your service role key from Supabase Dashboard > Project Settings > API > service_role");
  process.exit(1);
}

const sql = `
  ALTER TABLE mentor
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS profile_picture text;
`;

async function runMigration() {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    // Try via the SQL endpoint instead
    const res2 = await fetch(`${supabaseUrl}/pg/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });
    const text2 = await res2.text();
    console.log("Response:", res2.status, text2);
  } else {
    const json = await res.json();
    console.log("Migration result:", json);
  }
}

runMigration().catch(console.error);
