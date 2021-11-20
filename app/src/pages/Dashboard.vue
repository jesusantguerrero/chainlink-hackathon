<script setup lang="ts">
import Game from '../layouts/Game.vue';
import NFTList from '../components/NFTList.vue';
</script>

<template>
    <Game>
        <div class="px-5 py-3 mt-2 bg-gray-700 h-96 current-training">
            <h1 class="font-bold">My Roosters</h1>
            <NFTList />
        </div>
    
    </Game>

</template>