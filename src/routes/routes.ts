export const routes = {
    root: '/',
    login: '/login',
    signup: '/signup',
    dashboard: '/dashboard',
    crawl: (slug: string) => `/Crawl/${slug}`,
} as const;
  