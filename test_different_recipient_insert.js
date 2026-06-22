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
  console.log(`Logged in as User: ${userId}`);

  // Try to insert a notification to another user
  const otherUserId = "3bfb548b-b1a3-4463-87f3-de0ce66b35fa"; // A known student user ID
  console.log(`Attempting insert to recipient_id: ${otherUserId}...`);
  
  const { data, error } = await supabase
    .from("notification")
    .insert({
      recipient_id: otherUserId,
      sender_id: userId,
      question_id: 47,
      type: "new_reply"
    })
    .select();

  if (error) {
    console.error("Insert FAILED:", error.message);
  } else {
    console.log("Insert SUCCEEDED:", data);
    // Cleanup
    if (data && data[0]) {
      await supabase.from("notification").delete().eq("notification_id", data[0].notification_id);
    }
  }
}

run();
