import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
}

// @ts-ignore
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder_key");
