<script setup lang="ts">
import { ProviderState } from '../../composables/useWeb3Provider';
import { config } from '../../config';
import { getChainName } from '../../utils';
import WalletLogin from './WalletLogin.vue';

</script>

<template>
  <main> 
    <section class="relative w-full bg-gray-800">
      <div class="w-full bg-transparent">
        <Header />
        <div class="w-full py-2 font-bold text-center text-white bg-red-400" v-if="config.chainId && !ProviderState.isConnectedToValidNetwork" >
          You are in an invalid network <span class="px-2 py-1 bg-black rounded-md bg-opacity-10">{{ getChainName(ProviderState.chainId) }}</span>, the valid one is: <span class="px-2 py-1 bg-black rounded-md bg-opacity-10">{{ getChainName(config.chainId) }}</span>
        </div>
      </div>
      <div class="bg-gray-700 marketplace-content"> 
        <WalletLogin class="pt-5 mx-auto max-w-7xl"/>
      </div>
    </section>
  </main>
</template>