import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ["uz", "ru"];
let defaultLocale = "uz";

// Get the preferred locale from headers
function getLocale(request: NextRequest) {
  const headers = new Headers(request.headers)
  const acceptLanguage = headers.get('accept-language')
  
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'))
  }

  const headersObj = Object.fromEntries(headers.entries())
//   const languages = new Negotiator({ headers: headersObj }).languages()
  
//   return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname is root (/) or missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // Special handling for root path
    if (pathname === '/') {
      // For root path, redirect to default locale
      return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
    }

    // For other paths, add the locale prefix
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
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