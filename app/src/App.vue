<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { useMoralis } from "../composables/useMoralis";
import { AppState } from '../composables/AppState';

const { login, logout } = useMoralis();
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <button @click="login()" v-if="!AppState.user"> Login with moralis </button>
  <button @click="logout()" v-else="!AppState.user"> Logout </button>
  {{ AppState.user }}
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
