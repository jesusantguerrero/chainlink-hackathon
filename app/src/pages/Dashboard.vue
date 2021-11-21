<script setup lang="ts">
import Game from '../layouts/Game.vue';
import NFTList from '../components/NFTList.vue';
import { AppState } from '../composables/AppState';
import AuthHelper from '../components/basic/AuthHelper.vue';
</script>

<template>
    <Game>
        <div class="mt-5 bg-gray-700 h-96 current-training" :class="{'px-5 py-3': AppState.isConnected}">
            <NFTList v-if="AppState.isConnected"/>
            <AuthHelper v-else />
        </div>   
    </Game>

</template>