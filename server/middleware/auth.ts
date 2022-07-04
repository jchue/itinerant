import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey);

  const authHeader: string = event.req.headers.authorization;
  const token: string = authHeader ? authHeader.split('Bearer ')[1] : null;

  // Check if token returns valid user
  const { user, error } = await supabase.auth.api.getUser(token);

  event.context.auth = { supabase, user, error };
});
