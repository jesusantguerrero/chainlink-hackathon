<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";

const fetchMarketItems = async () => {
    const provider = getProvider()
    const { Cockfighter } = getContracts(provider);

    let roosters = await Cockfighter?.functions.pendingToClaim();
    roosters = await Promise.all(roosters[0].map(async(item: ethers.BigNumber) => {
        const tokenURI = await Cockfighter?.tokenURI(item.toNumber());
        const rooster = await fetch(tokenURI)
        .then(data => {
            console.log(data);
            return data.json()
        })
        .then( data => data)
        .catch(err => {
            console.log(err);
            return {};
        });
        
        return {...rooster};
    }))

    return roosters;
}

interface NFTAsset {
    id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    owner: string;
    claimable: boolean;
};

const items = ref<NFTAsset[]>([]);
onMounted(async () => {
    items.value = await fetchMarketItems();
})
</script>

<template>
    <div class="claimable-list">
        <div class="claimable-list__header">
            <h2 class="text-2xl">Claimable Roosters</h2>
        </div>
        <div class="flex flex-wrap gap-2 mt-5 claimable-list__items">
            <div v-for="item in items" class="claimable-list__item">
                <div class="overflow-hidden rounded-md claimable-list__item__image">
                    <img :src="item.image" class="w-64"/>
                </div>
            </div>
        </div>
    </div>
</template>
