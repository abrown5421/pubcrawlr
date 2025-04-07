export const routeToPageName = (pathname: string): string => {
    if (pathname === "/") return "Root";
    if (pathname === "/Login") return "Auth";
    if (pathname === "/Signup") return "Auth";
    if (/^\/Dashboard\/.+/.test(pathname)) return "Dashboard";
    if (/^\/Crawl\/.+/.test(pathname)) return "Crawl";
  
    return "Root"; 
};
  