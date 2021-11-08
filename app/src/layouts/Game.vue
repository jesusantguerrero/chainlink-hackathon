<script setup lang="ts">
import { ethers } from 'ethers';
import { computed, onMounted, ref } from 'vue';
import { useContract } from '../composables/useContract';
import GameHeader from '../components/GameHeader.vue';

const isOwner = ref(false);

const getIsOwner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const Tournament = useContract("Tournament", signer);
    const contractOwner = await Tournament?.functions.contractOwner();
    return contractOwner[0] === await signer.getAddress();
}

onMounted(async () => {
    isOwner.value = await getIsOwner();
})

const dashboardMenu = computed(() => {    
    const menu = [ {
        text: 'Dashboard',
        to: '/dashboard',
        icon: 'fa fa-home',
        active: false
    } , {
        text: 'Tournaments',
        to: '/tournaments',
        icon: 'fas fa-medal',
        active: false
    } ,
    {
        text: 'Marketplace',
        to: '/marketplace',
        icon: 'fas fa-store',
        active: false
    },
    {
        text: 'Players',
        to: '/players',
        icon: 'fa fa-users',
        active: false
    } , {
        text: 'Settings',
        to: '/settings',
        icon: 'fa fa-cogs',
        active: false
    } ];

    if (isOwner.value) {
        menu.push({
            text: 'Admin',
            to: '/admin',
            icon: 'fa fa-shield',
            active: false
        });
    }
    return menu;
});

</script>

<template>
   <GameHeader />

    <div class="mx-auto mt-10 text-white max-w-7xl">
        <ul class="flex justify-around text-white bg-gray-700">
            <router-link :to="item.to" v-for="item in dashboardMenu" class="w-full py-3 text-center cursor-pointer hover:bg-gray-800">
               <i :class="item.icon" />
               {{ item.text }}
            </router-link>
        </ul>
       <slot />
    </div>
</template>