<script setup lang="ts">
import Game from '../layouts/Game.vue';
import ClaimableList from '../components/ClaimableList.vue';
</script>

<template>
    <Game>
        <div class="mt-2 bg-gray-700 current-training">
         
            
            <div class="px-5 py-3 mt-5">
                <h2 class="text-2xl font-bold text-gray-300">
                    Marketplace
                </h2>
                <p class="text-gray-300">
                    Here you can claim, buy and sell items.
                </p>
                
                <ClaimableList class="mt-5" />
            </div>
        </div>
    </Game>

</template>