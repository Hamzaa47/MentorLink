// Run: node scratch/run_migration.mjs
// This script adds name and profile_picture columns to the mentor table

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://isxxzkcanajavlrietue.supabase.co";
const supabaseKey = "sb_publishable_QifhcxwPmmPSdxR66Qz_Ag_Cwgcvfpb";

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Checking current mentor table schema...");

  // First check what the mentor table looks like
  const { data: sample, error: sampleErr } = await supabase
    .from("mentor")
    .select("*")
    .limit(1);

  if (sampleErr) {
    console.error("Error reading mentor table:", sampleErr.message);
    return;
  }

  if (sample && sample.length > 0) {
    console.log("Current mentor row columns:", Object.keys(sample[0]));
    const hasName = "name" in sample[0];
    const hasPicture = "profile_picture" in sample[0];
    console.log("Has 'name' column:", hasName);
    console.log("Has 'profile_picture' column:", hasPicture);

    if (hasName && hasPicture) {
      console.log("\n✅ Columns already exist! No migration needed.");
      console.log("Now back-filling data from profile table...");
      await backfill();
      return;
    }
  } else {
    console.log("No mentor rows found, but table is accessible.");
    console.log("The DDL migration must be run manually in Supabase SQL Editor.");
    console.log("\nSQL to run:\n");
    console.log("ALTER TABLE mentor ADD COLUMN IF NOT EXISTS name text;");
    console.log("ALTER TABLE mentor ADD COLUMN IF NOT EXISTS profile_picture text;");
    return;
  }

  console.log("\n⚠️  The 'name' and 'profile_picture' columns are MISSING from the mentor table.");
  console.log("You need to run this SQL in your Supabase SQL Editor:");
  console.log("\n--- COPY THIS SQL ---");
  console.log("ALTER TABLE mentor");
  console.log("  ADD COLUMN IF NOT EXISTS name text,");
  console.log("  ADD COLUMN IF NOT EXISTS profile_picture text;");
  console.log("\nUPDATE mentor m");
  console.log("SET");
  console.log("  name = p.name,");
  console.log("  profile_picture = p.profile_picture");
  console.log("FROM profile p");
  console.log("WHERE p.id = m.mentor_id;");
  console.log("--- END SQL ---");
  console.log("\nGo to: https://supabase.com/dashboard/project/isxxzkcanajavlrietue/sql/new");
}

async function backfill() {
  // Get all mentors
  const { data: mentors, error } = await supabase.from("mentor").select("mentor_id, name, profile_picture");
  if (error) { console.error("Error:", error.message); return; }

  // Get all profiles for those mentor IDs
  const mentorIds = mentors.map(m => m.mentor_id).filter(Boolean);
  const { data: profiles } = await supabase.from("profile").select("id, name, profile_picture").in("id", mentorIds);

  const profileMap = {};
  (profiles || []).forEach(p => { profileMap[p.id] = p; });

  let updated = 0;
  for (const mentor of mentors) {
    if (!mentor.name && profileMap[mentor.mentor_id]) {
      const { error: updateErr } = await supabase
        .from("mentor")
        .update({
          name: profileMap[mentor.mentor_id].name,
          profile_picture: profileMap[mentor.mentor_id].profile_picture,
        })
        .eq("mentor_id", mentor.mentor_id);

      if (updateErr) {
        console.error("Error updating mentor", mentor.mentor_id, updateErr.message);
      } else {
        updated++;
        console.log("Updated mentor", mentor.mentor_id, "->", profileMap[mentor.mentor_id].name);
      }
    }
  }
  console.log(`\n✅ Back-fill complete. Updated ${updated} mentor rows.`);
}

migrate();
