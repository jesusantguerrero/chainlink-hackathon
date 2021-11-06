<script setup lang="ts">
import Game from '../layouts/Game.vue';
import NFTList from '../components/NFTList.vue';
import TournamentCreate from '../components/TournamentCreate.vue';
</script>

<template>
    <Game>
        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h2>Admin Pannel</h2>
        </div>
        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h2 class="md-5">Create Tournaments</h2>
            <TournamentCreate />
        </div>
    </Game>

</template>