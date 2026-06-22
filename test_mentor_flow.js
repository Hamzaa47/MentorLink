import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://isxxzkcanajavlrietue.supabase.co';
const supabaseKey = 'sb_publishable_QifhcxwPmmPSdxR66Qz_Ag_Cwgcvfpb';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function run() {
  const email = "23ntucsfl1003@student.ntu.edu.pk";
  const password = "23ntucsfl1003@student.ntu.edu.pk";

  console.log("Signing in...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error("Sign-in failed:", authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log(`Signed in. User ID: ${userId}`);

  // Check mentor table
  const { data: mentor, error: mentorErr } = await supabase
    .from("mentor")
    .select("*")
    .eq("mentor_id", userId)
    .maybeSingle();

  if (mentorErr) {
    console.error("Error fetching mentor:", mentorErr.message);
  } else {
    console.log("Mentor profile:", mentor);
  }

  // Check mentor_subjects
  const { data: mSubjects, error: msErr } = await supabase
    .from("mentor_subjects")
    .select("*")
    .eq("mentor_id", userId);

  if (msErr) {
    console.error("Error fetching mentor subjects:", msErr.message);
  } else {
    console.log("Mentor subjects:", mSubjects);
  }

  // Attempt to insert a test notification
  console.log("Attempting test notification insert...");
  const { data: notifData, error: notifErr } = await supabase
    .from("notification")
    .insert({
      recipient_id: userId,
      sender_id: userId,
      question_id: 47,
      type: "new_reply"
    })
    .select();

  if (notifErr) {
    console.error("Notification insert FAILED:", notifErr.message);
  } else {
    console.log("Notification insert SUCCEEDED:", notifData);
    
    // Clean up test notification
    if (notifData && notifData[0]) {
      console.log("Cleaning up test notification...");
      await supabase
        .from("notification")
        .delete()
        .eq("notification_id", notifData[0].notification_id);
    }
  }
}

run();
