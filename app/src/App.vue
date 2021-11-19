<script setup lang="ts">
import { useMoralis } from "./composables/useMoralis";
import MessageProvider from "./components/MessageProvider.vue";
import { onMounted } from "@vue/runtime-core";

const { login, init } = useMoralis();

onMounted(async () => {
  await init();
});
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
