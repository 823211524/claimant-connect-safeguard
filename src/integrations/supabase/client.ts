// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://jutcnpwfuyjmahtxrwer.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dGNucHdmdXlqbWFodHhyd2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTcyNjYsImV4cCI6MjA0ODUzMzI2Nn0.YN324oxLcb9DeO296JQkZWGkJ-Iy36Z3_Pw0-Q9PKBU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);