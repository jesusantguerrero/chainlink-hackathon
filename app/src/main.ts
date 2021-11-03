/* eslint-disable node/no-missing-import */
import { createApp } from "vue";
import App from "./App.vue";
import { AppState } from "./composables/AppState";
import "./assets/styles/main.css";
import { router } from "./router";

createApp(App).use(router).provide("AppState", AppState).mount("#app");
