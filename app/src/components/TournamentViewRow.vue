<script setup lang="ts">
import {  computed, PropType, ref, onMounted } from "vue";
import { useContract } from "../composables/useContract"
import { AtButton } from "atmosphere-ui";
import { IPlayer } from "../types";
import { AppState } from "../composables/AppState";
import { formatMaskedWallet } from "../utils";

const props = defineProps({
    currentTokenId: {
        type: Number,
    },
    playerId: {
        type: Number,
    },
    position: {
        type: Number,
    },
    isJoined: {
        type: Boolean,
    },
    isDarker: {
        type: Boolean,
    },
    player: {
        type: Object as PropType<IPlayer>,
        required: true,
    },
    eventId: {
        type: Number,
        required: true,
    },
});

const Tournament = useContract("Tournament", AppState.signer);

const fetchAlreadyFought = async () => {
    if (!AppState.roosters.length) {
        return false;
    }
    return (await Tournament?.eventToPlayerVsPlayer(props.eventId, props.playerId, props.player.playerId));
}

const canRequestFight = computed(() => {
    return props.player.tokenId !== props.currentTokenId && props.isJoined;
});

const alreadyFought = ref(true);

onMounted(async () => {
    if (props.isJoined) {
        alreadyFought.value = await fetchAlreadyFought();
    }
});

</script>

<template>
    <tr class="border border-gray-500" :class="{'bg-gray-600': isDarker}">
        <td class="px-4 py-2 text-center"># {{ position }}</td>
        <td class="px-4 py-2">
        <div class="flex items-center justify-center">
            <router-link :to="`/roosters/${player.tokenId}`">
                <img :src="player.image" alt="" class="w-20 h-20 rounded-md">
                <p class="font-bold capitalize">{{ player.name }}</p>
            </router-link>
            <div class="ml-2">
                <AtButton 
                    class="font-bold border-2 text-primary border-primary-400" 
                    @click="$emit('fight')"
                    v-if="canRequestFight && !alreadyFought"
                >
                    Fight
                </AtButton>
            </div>
        </div>
        </td>
        <td class="px-4 py-2 text-center">{{ player.record.wins + player.record.losses }}</td>
        <td class="px-4 py-2 text-center">{{ player.record.wins }}</td>
        <td class="px-4 py-2 text-center">{{ player.record.losses }}</td>
        <td class="px-4 py-2 text-center">{{ player.record.draws }}</td>
        <td class="px-4 py-2 text-center">{{ player.points }}</td>
        <td class="px-4 py-2 text-center">{{ formatMaskedWallet(player.owner) }}</td>
    </tr>
</template>
