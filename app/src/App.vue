<script setup lang="ts">
import { useMoralis } from "./composables/useMoralis";
import MessageProvider from "./components/MessageProvider.vue";

const { login } = useMoralis();
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
