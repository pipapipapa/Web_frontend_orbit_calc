export const ROUTES = {
    HOME: "/",
    ORBIT: "/orbit",
    MISSION: "/mission",
    LOGIN: "/login",
    REGISTER: "/register"
};

export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in string]: string } = {
    "/": "Каталог орбит",
    "/mission": "План миссии",
    "/login": "Аутентификация",
    "/register": "Регистрация"
};