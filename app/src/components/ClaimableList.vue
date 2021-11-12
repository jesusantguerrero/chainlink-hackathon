<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";
import { IPreToken } from "../types";

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
    await RoosterFight?.functions.mint(token.id);
    await fetchMarketItems();
} 

const items = ref<IPreToken[]>([]);
onMounted(async () => {
    items.value = await fetchMarketItems();
})
</script>

<template>
    <div class="px-5 claimable-list">
        <div class="claimable-list__header">
            <h2 class="text-2xl">Claimable Roosters</h2>
        </div>
        <div class="flex flex-wrap gap-2 mt-5 claimable-list__items">
            <div v-for="item in items" class="claimable-list__item">
                <div class="overflow-hidden rounded-t-md claimable-list__item__image">
                    <img :src="item.uri" class="w-64"/>
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
