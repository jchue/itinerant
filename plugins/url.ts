export default defineNuxtPlugin((nuxtApp) => {
  function hashParam(name) {
    const route = useRoute();
    const query = route.hash.replace('#', '');

    if (!query) return null;

    const params = query.split('&');

    const parsed = {};
    params.forEach((param) => {
      const parsedParam = param.split('=');

      // Replace all + with spaces
      const regex = /\++/g;

      const key = parsedParam[0].replace(regex, ' ');
      const value = parsedParam[1] ? parsedParam[1].replace(regex, ' ') : '';

      parsed[key] = value;
    });

    return parsed;
  }

  return {
    provide: {
      hashParam,
    },
  };
});
