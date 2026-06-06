import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

// Exclude Payload routes (admin, api), Next internals, and files with extensions
// — public pages route through this middleware so locale resolution applies.
export const config = {
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
}
