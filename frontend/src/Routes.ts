export const ROUTES = {
    HOME: "/",
    ORBIT: "/orbit",
    MISSION: "/mission",
};

export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: "Каталог орбит",
    ORBIT: "Детали орбиты",
    MISSION: "План миссии",
};