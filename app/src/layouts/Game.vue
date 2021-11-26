<script setup lang="ts">
import { computed, ref } from 'vue';
import GameHeader from '../components/GameHeader.vue';

defineProps({
  showNavbar: {
    type: Boolean,
    default: true,
  },
});

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
        text: 'Rankings',
        to: '/rankings',
        icon: 'fa fa-users',
        active: false
    }];
    return menu;
});

</script>

<template>
   <GameHeader />

    <div class="mx-auto mt-10 mb-10 text-white max-w-7xl">
        <nav class="flex justify-around text-white bg-gray-700" v-if="showNavbar">
            <router-link :to="item.to" v-for="item in dashboardMenu" class="w-full py-3 text-center border-b-4 border-transparent cursor-pointer game-link hover:bg-gray-800">
               <i :class="item.icon" />
               {{ item.text }}
            </router-link>
        </nav>
       <slot />
    </div>
</template>

<style lang="scss">
.game-link.router-link-active, .game-link:hover {
    @apply bg-primary-50 border-b-4 border-primary bg-opacity-5 text-primary;
}
</style>
