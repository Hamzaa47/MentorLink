import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://isxxzkcanajavlrietue.supabase.co';
const supabaseKey = 'sb_publishable_QifhcxwPmmPSdxR66Qz_Ag_Cwgcvfpb';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Fetching questions...");
  const { data: questions, error: qErr } = await supabase
    .from("question")
    .select("question_id, topic, uploaded_at")
    .order("uploaded_at", { ascending: false })
    .limit(5);

  if (qErr) {
    console.error("Error fetching questions:", qErr);
  } else {
    console.log("Recent questions:");
    questions.forEach(q => {
      console.log(`- ID: ${q.question_id}, Topic: ${q.topic}, Raw uploaded_at: ${q.uploaded_at}`);
    });
  }

  console.log("\nFetching replies...");
  const { data: replies, error: rErr } = await supabase
    .from("reply")
    .select("reply_id, question_id, description, replied_at")
    .order("replied_at", { ascending: false })
    .limit(5);

  if (rErr) {
    console.error("Error fetching replies:", rErr);
  } else {
    console.log("Recent replies:");
    replies.forEach(r => {
      console.log(`- ID: ${r.reply_id}, Q_ID: ${r.question_id}, Msg: ${r.description}, Raw replied_at: ${r.replied_at}`);
    });
  }
}

check();
