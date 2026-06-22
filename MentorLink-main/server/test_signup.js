import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = "23ntucsfl1003@student.ntu.edu.pk";
  const password = "SomePassword123!";

  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key starts with:", supabaseKey ? supabaseKey.substring(0, 15) : "none");

  console.log("Trying to signUp with existing email using server dependencies...");
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SignUp response error:", error);
    console.log("SignUp response data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Exception during signup:", err);
  }
}

run();
