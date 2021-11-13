<script setup lang="ts">
import Game from '../layouts/Game.vue';
import TournamentList from '../components/TournamentList.vue';
import { useRoute } from 'vue-router';
import { computed, ref } from '@vue/reactivity';
import TournamentView from '../components/TournamentView.vue';
import { watch } from 'vue';

const route = useRoute();

const tournamentId = ref<string>();


const title = computed(() => {
  return tournamentId.value  ? 'Tournament View' : 'Active Tournaments'
});

const currentView = computed(() => {
  return tournamentId.value ? TournamentView : TournamentList;
});

watch(() => route.path, () => {
  if (route.params.id && typeof route.params.id == 'string') {
    tournamentId.value = route.params.id;
  } else {
    tournamentId.value = undefined;
  }
}, {immediate: true });


</script>

<template>
    <Game>
        <div class="mt-2 bg-gray-700 current-training">
            <component :is="currentView"  :id="tournamentId" />
        </div>
    </Game>

</template>