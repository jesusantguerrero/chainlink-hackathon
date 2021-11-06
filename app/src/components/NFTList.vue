<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts"
import { ref } from "vue";

const fetchMyItems = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const { Cockfighter } = getContracts(signer);

    let roosters = await Cockfighter?.functions.getMyRoosters();
    roosters = await Promise.all(roosters[0].map(async(item: ethers.BigNumber) => {
        const tokenURI = await Cockfighter?.tokenURI(item.toNumber());
        const rooster = await fetch(tokenURI)
        .then(data => {
            return data.json()
        })
        .then( data => data)
        .catch(err => {
            return {};
        });
        
        return {
            tokenId: item.toNumber(), 
            ...rooster
        };
    }))

    return roosters;
}

interface NFTAsset {
    tokenId: number;
    name: string;
    description: string;
    image: string;
    price: string;
    owner: string;
    claimable: boolean;
};


const items = ref<NFTAsset[]>([]);
onMounted(async () => {
    items.value = await fetchMyItems();
})
</script>

<template>
    <div class="claimable-list">
        <div class="flex flex-wrap gap-2 mt-5 claimable-list__items">
            <div v-for="item in items" class="overflow-hidden border rounded-md claimable-list__item">
                <div class="overflow-hidden rounded-t-md claimable-list__item__image">
                    <img :src="item.image" class="w-64"/>
                    <div class="px-4 pb-3 bg-gray-700">
                        <h3 class="text-xl">{{item.name}}</h3>
                        <p class="text-sm text-gray-300">{{item.description}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
