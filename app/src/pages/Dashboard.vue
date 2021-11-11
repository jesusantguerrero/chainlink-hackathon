<script setup lang="ts">
import Game from '../layouts/Game.vue';
import NFTList from '../components/NFTList.vue';
</script>

<template>
    <Game>
        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h1 class="font-bold">My Roosters</h1>
            <NFTList />
        </div>
        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h1 class="font-bold"> Tournaments</h1>
            <div class="flex gap-5 mt-5">
                <div class="w-4/12 space-y-2">
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                        // Tournament Info
                    </div>
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                        // Sponsor
                    </div>
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                        // Notifications
                    </div>
                </div>
                <div class="w-8/12">
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                    
                    </div>
                </div>
            </div>
        </div>
    </Game>

</template>