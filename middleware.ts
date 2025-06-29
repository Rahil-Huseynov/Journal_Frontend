import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "ru", "az"],

  // Used when no locale matches
  defaultLocale: "az",
})

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(az|en|ru)/:path*"],
}
