<script setup lang="ts">
import { initProvider, useMoralis } from "./composables/useMoralis";
import MessageProvider from "./components/MessageProvider.vue";

const { login } = useMoralis();
initProvider();
</script>

<template>
  <MessageProvider>
    <router-view @connect="login()" />
  </MessageProvider>
</template>

<style>
html {
  @apply bg-gray-900;
}
</style>
