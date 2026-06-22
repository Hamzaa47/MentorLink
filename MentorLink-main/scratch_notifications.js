import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://isxxzkcanajavlrietue.supabase.co';
const supabaseKey = 'sb_publishable_QifhcxwPmmPSdxR66Qz_Ag_Cwgcvfpb';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from("notification")
    .select("*");
  
  if (error) {
    console.error("Error fetching notifications:", error.message);
  } else {
    console.log(`Found ${data.length} notifications:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

check();
