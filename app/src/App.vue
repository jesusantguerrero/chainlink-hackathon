<script setup lang="ts">
import { useMoralis } from "./composables/useMoralis";
import { AppState } from './composables/AppState';
import Pages from './pages/index.vue';

const { login, logout } = useMoralis();
</script>

<template>
  <Pages @connect="login()" />
</template>

<style>
html {
  @apply bg-gray-900;
}
</style>
