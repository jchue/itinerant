import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

  return {
    provide: {
      supabase,
    },
  };
});
