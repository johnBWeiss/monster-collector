import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sxnbepesemeqhhqdhjzr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bmJlcGVzZW1lcWhocWRoanpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDU1NjEsImV4cCI6MjA1MTU4MTU2MX0.aDByNwGNofyoe3kGA-hbTmKnQ5Y62zmssOsGYtWERN0";

export const supabase = createClient(supabaseUrl, supabaseKey);
