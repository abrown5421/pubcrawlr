export const routes = {
    root: '/',
    login: '/login',
    signup: '/signup',
    dashboard: (slug: string) => `/Dashboard/${slug}`,
    crawl: (slug: string) => `/Crawl/${slug}`,
} as const;
  