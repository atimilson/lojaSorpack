import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/minha-conta';
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/minha-conta/') || 
                          request.nextUrl.pathname === '/carrinho';

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!token && isProtectedRoute) {
    const url = new URL('/minha-conta', request.url);
    url.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Se estiver autenticado e tentar acessar página de login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/minha-conta/usuario', request.url));
  }

  return NextResponse.next();
}

// Configuração mais específica do matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/minha-conta/:path*',
    '/carrinho'
  ]
}; 