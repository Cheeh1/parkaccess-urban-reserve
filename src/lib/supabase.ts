
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the supabase client from the integrations folder which is already configured
export const supabase = supabaseClient;
