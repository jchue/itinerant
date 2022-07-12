import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey);

  const authHeader: string = event.req.headers.authorization;
  const token: string = authHeader ? authHeader.split('Bearer ')[1] : null;

  try {
    if (!token) throw new Error();

    // Check if token returns valid user
    const { user, error } = await supabase.auth.api.getUser(token);

    if (error) throw error;

    event.context.auth = { supabase, user, error };
  } catch (error) {
    const user = null;

    event.context.auth = { supabase, user, error };
  }
});
