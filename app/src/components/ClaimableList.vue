<script setup lang="ts">
import { onMounted, nextTick, computed } from "vue";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";
import { IPreToken } from "../types";
import { AppState } from "../composables/AppState";

const props = defineProps({
    limit: {
        type: Number,
    }
});

const provider = getProvider()
const RoosterFight = useContract("RoosterFight", provider);

const fetchMarketItems = async () => {
    let roosters = await RoosterFight?.pendingToMint();
    return roosters;
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

const visibleItems = computed(() => {
    return props.limit ? items.value.slice(0, props.limit) : items.value;
})
</script>

<template>
    <div class="claimable-list">
        <div class="mt-10 text-4xl text-center text-white" v-if="isLoading">
            <i class=" fa fa-circle-notch fa-spin fa-3x fa-fw" />
        </div>
        <div class="flex flex-wrap justify-center gap-2 mt-5 claimable-list__items" v-else>
            <div v-for="item in visibleItems" class="claimable-list__item">
                <div class="overflow-hidden border rounded-md claimable-list__item__image">
                    <div class="relative w-64 h-64 bg-primary border-roti-400">
                        <img :src="item.uri" class="absolute z-20" />
                        <div class="absolute bottom-0 right-0 w-1/2 h-full bg-black bg-opacity-10">
                        </div>
                    </div>
                    <div class="px-4 pb-3 bg-gray-700">
                        <h3 class="text-xl">Rooster #{{item.id}}</h3>
                    </div>
                    <div class="flex items-center justify-between overflow-hidden bg-primary rounded-b-md">
                        <div class="block w-full h-full px-4 py-2 bg-gray-700">Price: Free</div>
                        <Button @click="claim(item)" class="block w-full px-4 py-2 text-white bg-primary-500 hover:bg-primary-600 rounded-br-md"> 
                            Claim Token
                        </Button>
                    </div>
                </div>
            </div>

            <RouterLink to="/marketplace" class="px-5 py-1 mx-auto mt-5 font-bold text-purple-300 transition transform border-2 border-purple-300 rounded-md hover:scale-105 hover:bg-purple-300 hover:text-white" v-if="limit">
                View More
            </RouterLink>
        </div>
    </div>
</template>
