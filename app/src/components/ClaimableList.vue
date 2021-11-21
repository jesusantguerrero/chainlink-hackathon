<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";
import { IPreToken } from "../types";
import { AppState } from "../composables/AppState";

const provider = getProvider()
const Cockfighter = useContract("RoosterFight", provider);

const fetchMarketItems = async () => {
    let roosters = await Cockfighter?.functions.pendingToMint();
    return roosters[0];
}

const claim = async (token: IPreToken) => {
    const provider = new ethers.providers.Web3Provider(window?.ethereum, "any");
    const signer = provider.getSigner();
    const RoosterFight = useContract("RoosterFight", signer);
    const trx = await RoosterFight?.functions.mint(token.id);
    trx?.wait();
    await AppState.fetchMyNfts();
    await fetchMarketItems();
} 

const items = ref<IPreToken[]>([]);
const isLoading = ref(true);
onMounted(async () => {
    items.value = await fetchMarketItems();
    nextTick(() => {
        isLoading.value = false;
    });
})
</script>

<template>
    <div class="claimable-list">
        <div class="mt-10 text-4xl text-center text-white" v-if="isLoading">
            <i class=" fa fa-circle-notch fa-spin fa-3x fa-fw" />
        </div>
        <div class="flex flex-wrap gap-2 mt-5 claimable-list__items" v-else>
            <div v-for="item in items" class="claimable-list__item">
                <div class="overflow-hidden border rounded-md claimable-list__item__image">
                    <div class="relative w-64 h-64 bg-purple-500 border-roti-400">
                        <img :src="item.uri" class="absolute z-20" />
                        <div class="absolute bottom-0 right-0 w-1/2 h-full bg-black bg-opacity-10">
                        </div>
                    </div>
                    <div class="px-4 pb-3 bg-gray-700">
                        <h3 class="text-xl">Rooster #{{item.id}}</h3>
                    </div>
                    <div class="flex items-center justify-between overflow-hidden bg-purple-500 rounded-b-md">
                        <div class="block w-full h-full px-4 py-2 bg-gray-700">Price: Free</div>
                        <Button @click="claim(item)" class="block w-full px-4 py-2 text-white bg-purple-500 hover:bg-purple-900 rounded-br-md"> 
                            Claim Token
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
