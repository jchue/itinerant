import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export const config = {
  matcher: ['/api/trips/:function*', '/api/flights/:function*', '/api/stays/:function*'],
};

export async function middleware(req) {
  const authHeader: string = req.headers.get('authorization');
  const token: string = authHeader ? authHeader.split('Bearer ')[1] : null;

  try {
    if (!token) throw new Error();

    // Check if token returns valid user
    const { user, error } = await supabase.auth.api.getUser(token);

    if (error) throw error;

    // Clone the request headers and set a new user header
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('userid', user.id)

    const res = NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    })

    return res;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        statusCode: 401,
        statusMessage: 'Invalid token',
      }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' }
      }
    )
  }
}
