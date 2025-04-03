export const routes = {
    root: '/',
    login: '/login',
    signup: '/signup',
    dashboard: '/Dashboard',
    crawl: (slug: string) => `/Crawl/${slug}`,
} as const;
  