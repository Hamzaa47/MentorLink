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

  const { data: authData } = await supabase.auth.signInWithPassword({ email, password });
  const userId = authData.user.id;

  console.log("Attempting insert with string question_id: '47'...");
  const { data: stringData, error: stringErr } = await supabase
    .from("notification")
    .insert({
      recipient_id: userId,
      sender_id: userId,
      question_id: "47",
      type: "new_reply"
    });

  if (stringErr) {
    console.error("String ID insert FAILED:", stringErr.message);
  } else {
    console.log("String ID insert SUCCEEDED!");
  }

  console.log("\nAttempting insert with numeric question_id: 47...");
  const { data: numData, error: numErr } = await supabase
    .from("notification")
    .insert({
      recipient_id: userId,
      sender_id: userId,
      question_id: 47,
      type: "new_reply"
    })
    .select();

  if (numErr) {
    console.error("Numeric ID insert FAILED:", numErr.message);
  } else {
    console.log("Numeric ID insert SUCCEEDED!");
    if (numData && numData[0]) {
      await supabase.from("notification").delete().eq("notification_id", numData[0].notification_id);
    }
  }
}

run();
