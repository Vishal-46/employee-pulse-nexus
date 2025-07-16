
import { createClient } from '@supabase/supabase-js';

// These will need to be set up by the user in their Supabase project
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Employee {
  id?: number;
  name: string;
  email: string;
  emp_num: string;
  phone_no: string;
  created_at?: string;
  updated_at?: string;
}
