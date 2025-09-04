import { useLocation } from "react-router-dom";

interface BreadcrumbEntry {
  path: string;
  breadcrumb: string;
}


export function useBreadcrumbs(breadcrumbMap: BreadcrumbEntry[]) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x); //or u can use  const pathnames = location.pathname.split("/").filter(Boolean); this will remove " " from the array.

  return pathnames.map((_, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
     const match = breadcrumbMap.find(b => b.path === to);
    const rawLabel = match?.breadcrumb;
    const label = rawLabel ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1) : decodeURIComponent(pathnames[index]);
   // or you can use this below line instead of above 2 lines
    //const label = breadcrumbMap[to]?.charAt(0).toUpperCase() + breadcrumbMap[to]?.slice(1) || decodeURIComponent(pathnames[index]);
    const isLast = index === pathnames.length - 1;
    return { to, label, isLast };
  });
}



 

