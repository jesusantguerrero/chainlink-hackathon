<script lang="ts" setup>
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useContract } from '../composables/useContract';
import Game from '../layouts/Game.vue';
import { INftDetails } from '../types';
import { getProvider } from '../composables/getProvider';
import RoosterCard from '../components/RoosterCard.vue';

const route = useRoute();
const provider = getProvider();
const Cockfighter = useContract("RoosterFight", provider);

const rooster = ref<null|INftDetails>(null);
const isFetching = ref(true);

const fetchRooster = async (tokenId: number): Promise<INftDetails> => {
    return await Cockfighter?.functions.getDetails(tokenId);
};
watch(() => route.path, async () => {
    if (route.params.id && typeof route.params.id == 'string') {
        rooster.value = await fetchRooster(Number(route.params.id));
       isFetching.value = false;
  }
}, { immediate: true });
</script>

<template>
<Game>
    <div class="px-5 py-3 mt-2 bg-gray-700 h-96 current-training">
       <RoosterCard :rooster="rooster" v-if="rooster"/>
    </div>
</Game>
</template>

<style>
.attacker {
    transform: rotateY(180deg);
}
</style>

