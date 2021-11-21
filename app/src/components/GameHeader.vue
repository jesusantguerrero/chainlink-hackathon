<script lang="ts" setup>
import { AppState } from '../composables/AppState';
import { useWeb3 } from '../composables/useWeb3Provider';
import WalletAccount from './basic/WalletAccount.vue';
import NetworkBadge from './basic/NetworkBadge.vue';
import { config } from '../config';
const ProviderState = useWeb3();
</script>

<template>
   <div class="relative flex justify-between px-5 py-3 text-white bg-gray-700">
        <div class="flex items-center space-x-2">
            <router-link to="/" class="px-3 text-2xl border border-transparent rounded-md hover:bord hover:bg-gray-800 er-gray-600">
                <i class="fa fa-chevron-left"></i>
            </router-link>
            <h1 class="text-2xl font-bold text-purple-400">
                Home
            </h1>
        </div>
        <div class="relative flex mr-24 space-x-2">
            <div class="flex items-center text-center">Tokens {{ ProviderState.balance }}</div>
            <NetworkBadge :chain="ProviderState.chainId" :valid-chain="config.chainId" />
            <WalletAccount :account="ProviderState.account" />
        </div>
        <div class="absolute top-0 w-20 h-20 overflow-hidden bg-gray-700 border rounded-md right-5">
            <img :src="AppState.roosters[0].image" v-if="AppState.roosters.length" class="w-full" />
        </div>
    </div>
</template>