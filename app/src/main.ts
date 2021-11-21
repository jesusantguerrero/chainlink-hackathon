/* eslint-disable node/no-missing-import */
import { createApp } from "vue";
import App from "./App.vue";
import { AppState } from "./composables/AppState";
import { ProviderState } from "./composables/useWeb3Provider";
import "./assets/styles/main.css";
import { router } from "./router";

createApp(App)
  .use(router)
  .provide("AppState", AppState)
  .provide("ProviderState", ProviderState)
  .mount("#app");
