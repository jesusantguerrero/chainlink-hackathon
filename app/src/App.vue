<script setup lang="ts">
import { useMoralis } from "./composables/useMoralis";

const { login } = useMoralis();
</script>

<template>
  <router-view @connect="login()" />
</template>

<style>
html {
  @apply bg-gray-900;
}
</style>
