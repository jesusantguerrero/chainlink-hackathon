<script setup lang="ts">
import Game from '../layouts/Game.vue';
import NFTList from '../components/NFTList.vue';
import { AppState } from '../composables/AppState';
</script>

<template>
    <Game>
        <div class="px-5 py-3 mt-2 bg-gray-700 h-96 current-training">
            <NFTList v-if="AppState.isConnected"/>
            <div v-else>
            </div>
        </div>
    
    </Game>

</template>