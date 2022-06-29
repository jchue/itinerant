export default defineNuxtRouteMiddleware((to, from) => {
  const { $supabase } = useNuxtApp();
  const route = useRoute();

  const session = $supabase.auth.session();

  if (!session) {
    return navigateTo(`/login?redirect=${route.fullPath}${route.hash}`);
  }

  return null;
});
