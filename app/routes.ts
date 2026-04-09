import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("visualizer/:id", "routes/visualizer.$id.tsx"),
  route("api", "routes/api.tsx"),
  route("docs", "routes/docs.tsx"),
  route("legal", "routes/legal.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("cookies", "routes/cookies.tsx"),
] satisfies RouteConfig;
