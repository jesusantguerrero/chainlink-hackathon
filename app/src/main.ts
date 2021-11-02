import { createApp } from 'vue'
import App from './App.vue'
import { AppState } from "./composables/AppState";
import "./assets/styles/main.css";

createApp(App)
.provide('AppState', AppState)
.mount('#app')
