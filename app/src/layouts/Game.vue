<script setup lang="ts">
import { ethers } from 'ethers';
import { computed, onMounted, ref } from 'vue';
import { getContracts } from '../composables/getContracts';

const isOwner = ref(false);

const getIsOwner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const { Tournament } = getContracts(signer);
    const contractOwner = await Tournament?.functions.contractOwner();
    return contractOwner[0] === await signer.getAddress();
}

onMounted(async () => {
    isOwner.value = await getIsOwner();
})

const dashboardMenu = computed(() => {    
    const menu = [
        "General",
        "Tournaments",
        "Sponsors",
        "Notifications"
    ];
    if (isOwner.value) {
        menu.push("Admin");
    }
    return menu;
});

</script>

<template>
    <div class="flex justify-between px-5 py-3 text-white bg-gray-700">
        <div>
            <h1 class="text-2xl font-bold text-purple-400">Home</h1>
        </div>
        <div class="flex space-x-2">
            <div>Tokens</div>
            <div>Money</div>
            <div>Energy</div>
            <div>Hospital Points</div>
        </div>
    </div>

    <div class="mx-auto mt-10 text-white max-w-7xl">
        <ul class="flex justify-around text-white bg-gray-700">
            <li v-for="item in dashboardMenu" class="w-full py-3 text-center cursor-pointer hover:bg-gray-800">{{
                item
            }}</li>
        </ul>
       <slot />
    </div>
</template>