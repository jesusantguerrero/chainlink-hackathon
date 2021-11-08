<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";

const fetchMarketItems = async () => {
    const provider = getProvider()
    const Cockfighter = useContract("RoosterFight", provider);

    let roosters = await Cockfighter?.functions.pendingToClaim();
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

const claim = async (tokenId: Number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const { Claimer, Cockfighter } = getContracts(signer);
    const signerAddress = await signer.getAddress()
    await Claimer?.functions.claim(Cockfighter?.address, tokenId, signerAddress);
    await fetchMarketItems();
} 

const items = ref<NFTAsset[]>([]);
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
                    <img :src="item.image" class="w-64"/>
                    <div class="px-4 pb-3 bg-gray-700">
                        <h3 class="text-xl">{{item.name}}</h3>
                        <p class="text-sm text-gray-300">{{item.description}}</p>
                    </div>
                    <div class="flex items-center justify-between overflow-hidden bg-purple-500 rounded-b-md">
                        <div class="block w-full h-full px-4 py-2 bg-gray-700">Price: Free</div>
                        <Button @click="claim(item.tokenId)" class="block w-full px-4 py-2 text-white bg-purple-500 hover:bg-purple-900 rounded-br-md"> 
                            Claim Token
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
