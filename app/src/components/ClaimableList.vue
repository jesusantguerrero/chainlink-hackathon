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
    console.log(roosters);
    roosters = await Promise.all(roosters.map(async(item: ethers.BigNumber) => {
        console.log(item);
        const tokenURI = await Cockfighter?.functions.tokenURI(item.toNumber());
        const rooster = await fetch(tokenURI).then(data => data.json()).then( data => data).catch(err => ({}));
        
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
            <h2>Claimable Roosters</h2>
        </div>
        <div class="claimable-list__items">
            <div v-for="item in items" class="claimable-list__item">
                <div class="claimable-list__item__image">
                    <img :src="item.image" />
                </div>
            </div>
        </div>
    </div>
</template>
