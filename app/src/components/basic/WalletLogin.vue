<template>
  <section class="py-5 text-center text-white">
    <h1 class="text-xl font-bold"> You need an Ethereum wallet to login to RoosterFight.</h1>
    <h2 class="mb-10 text-sm font-bold text-gray-300">Connect with one of our available wallet providers or create a new one.</h2>
    
    <div 
      target="_blank"
      @click.prevent="connectWithMetamask" 
      class="flex items-center justify-between w-full max-w-4xl px-5 mx-auto space-x-5 overflow-hidden font-bold bg-gray-800 border border-gray-700 rounded-md cursor-pointer h-14"
    >
        Connect with MetaMask: <span class="text-gray-300">if not installed it will install first</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import MetaMaskOnboarding from '@metamask/onboarding';
import { useMoralis } from "../../composables/useMoralis";

const hasMetamask = computed(() => {
  return !!window.ethereum;
})

const { login } = useMoralis()
const connectWithMetamask = async () => {
  if (hasMetamask.value) {
    login();
  } else {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
  }
}
</script>
