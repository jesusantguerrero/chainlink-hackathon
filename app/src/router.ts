import { createRouter, createWebHistory } from "vue-router";
import Index from "./pages/index.vue";
import Dashboard from "./pages/Dashboard.vue";
import Admin from "./pages/Admin.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Index,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: "/dashboard",
      component: Dashboard,
    },
    {
      path: "/admin",
      component: Admin,
    },
    {
      path: "/signup",
      component: Dashboard,
    },
    {
      path: "/login",
      component: Dashboard,
    },
    {
      path: "/marketplace",
      component: Dashboard,
    },
  ],
});
