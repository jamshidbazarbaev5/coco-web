import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ["uz", "ru"];
let defaultLocale = "uz";

// Get the preferred locale from headers
function getLocale(request: NextRequest) {
  // Get accept-language header
  const acceptLanguage = request.headers.get('accept-language')
  
  if (!acceptLanguage) return defaultLocale;
  
  // Check if any of our locales match the accepted languages
  const preferredLocale = locales.find(locale => 
    acceptLanguage.toLowerCase().includes(locale)
  );
  
  return preferredLocale || defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // For root path or paths missing locale, redirect with locale prefix
    return NextResponse.redirect(
      new URL(
        pathname === '/' ? `/${locale}` : `/${locale}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
    // Optional: Match root path
    '/',
    // Add news paths
    '/news/:path*'
  ],
}