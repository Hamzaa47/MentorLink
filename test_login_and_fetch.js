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

  console.log("Signing in with credentials...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error("Sign-in failed:", authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log(`Successfully signed in. User ID: ${userId}`);

  // Fetch notifications
  const { data: notifications, error: notifError } = await supabase
    .from("notification")
    .select("*")
    .eq("recipient_id", userId);

  if (notifError) {
    console.error("Error fetching notifications:", notifError.message);
  } else {
    console.log(`\nFound ${notifications.length} notifications:`);
    console.log(JSON.stringify(notifications, null, 2));
  }

  // Fetch student questions
  const { data: questions, error: qError } = await supabase
    .from("question")
    .select("*")
    .eq("student_id", userId);

  if (qError) {
    console.error("Error fetching questions:", qError.message);
  } else {
    console.log(`\nFound ${questions.length} questions:`);
    console.log(JSON.stringify(questions, null, 2));
    
    if (questions.length > 0) {
      const qIds = questions.map(q => q.question_id);
      // Fetch replies
      const { data: replies, error: rError } = await supabase
        .from("reply")
        .select("*")
        .in("question_id", qIds);
        
      if (rError) {
        console.error("Error fetching replies:", rError.message);
      } else {
        console.log(`\nFound ${replies.length} replies to student's questions:`);
        console.log(JSON.stringify(replies, null, 2));
      }
    }
  }
}

run();
