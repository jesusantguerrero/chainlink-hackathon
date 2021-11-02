<script setup lang="ts">
import { useMoralis } from "./composables/useMoralis";
import { AppState } from './composables/AppState';
import Pages from './pages/index.vue';

const { login, logout } = useMoralis();
</script>

<template>
  <Pages />
  <button @click="login()" v-if="!AppState.user"> Login with moralis </button>
  <button @click="logout()" v-else="!AppState.user"> Logout </button>
  {{ AppState.user }}
</template>
