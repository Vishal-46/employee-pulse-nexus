
import { createClient } from '@supabase/supabase-js';

// These will need to be set up by the user in their Supabase project
// Using valid URL format to prevent runtime errors
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key-here';

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
