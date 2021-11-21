import { createRouter, createWebHistory } from "vue-router";
import Index from "./pages/index.vue";
import Dashboard from "./pages/Dashboard.vue";
import Admin from "./pages/Admin.vue";
import Tournaments from "./pages/Tournaments.vue";
import Marketplace from "./pages/Marketplace.vue";
import Match from "./pages/Match.vue";
import Rooster from "./pages/Rooster.vue";

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
      path: "/tournaments",
      component: Tournaments,
    },
    {
      path: "/marketplace",
      component: Marketplace,
    },
    {
      path: "/tournaments/:id",
      component: Tournaments,
    },
    {
      path: "/roosters/:id",
      component: Rooster,
    },
    {
      path: "/match/:id",
      component: Match,
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
