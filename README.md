# Itinerant

An open-source trip planner built using [Nuxt 3](https://v3.nuxtjs.org) for the framework, [Prisma](https://www.prisma.io) for the ORM, and [Supabase](https://supabase.com) for auth.

## Development

**Prerequisites**

- Postgres database
- Supabase account
- Map style (get one from [MapTiler](https://www.maptiler.com))

**Environment Variables**

Name|Description|Example
-|-|-
DATABASE_URL|Postgres connection URL|postgresql://user:password@localhost:5432/database?schema=public
NUXT_PUBLIC_SUPABASE_URL|Supabase project URL|https://abcdefghijklmnop.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY|Supabase public project key|(JWT)
NUXT_SUPABASE_SERVICE_ROLE_KEY|Supabase secret project key|(JWT)
NUXT_PUBLIC_MAP_STYLE|Map style JSON URL|https://api.maptiler.com/maps/abcdefgh-1234-abcd-5678-ijklmnopqrst/style.json?key=abcdefghijklmnop

**Install Dependencies**

```bash
npm install
```

**Start Development Server**

```bash
npm run dev
```