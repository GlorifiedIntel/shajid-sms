import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth({
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      // Protect /admin routes for only admin users
      if (pathname.startsWith('/admin')) {
        return token?.role === 'admin';
      }

      // Allow access to /dashboard if user is logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/dashboard', '/admin/:path*'],
};