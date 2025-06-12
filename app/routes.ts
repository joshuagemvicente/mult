import { type RouteConfig, index, prefix, route, layout } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
layout("routes/auth/auth-layout.tsx", [
  route("login", "routes/auth/login.tsx"),
  route("signup", "routes/auth/signup.tsx")
]),

layout("./routes/modules/_layout.tsx", [
  ...prefix("dashboard", [
    index("./routes/modules/dashboard/index.tsx"),
  ])
]),

...prefix("api", [
  route("auth/*", "routes/api/better.tsx")
])

] satisfies RouteConfig;
