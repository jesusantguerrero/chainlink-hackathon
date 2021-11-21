<script setup lang="ts">
import {  computed, PropType } from "vue";
import { useContract } from "../composables/useContract"
import { AtButton } from "atmosphere-ui";
import { IPlayer } from "../types";
import { AppState } from "../composables/AppState";
import { formatMaskedWallet } from "../utils";

const props = defineProps({
    currentTokenId: {
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
});

const Tournament = useContract("Tournament", AppState.signer);

const canRequestFight = computed(() => {
    return props.player.tokenId !== props.currentTokenId && props.isJoined;
});

const alreadyFought = computed(() => {
    return props.currentTokenId === props.player.tokenId;
});

</script>

<template>
    <tr class="border border-gray-500" :class="{'bg-gray-600': isDarker}">
        <td class="px-4 py-2 text-center"># {{ position }}</td>
        <td class="px-4 py-2">
        <div class="flex justify-center">
            <img :src="player.image" alt="" class="w-20 h-20 rounded-md">
            <div class="ml-2">
                <p class="capitalize">{{ player.name }}</p>
                <AtButton 
                    class="font-bold bg-purple-400" 
                    @click="$emit('fight')"
                    v-if="canRequestFight"
                    :disabled="alreadyFought"
                >
                    Fight {{ player.tokenId }} {{ currentTokenId }}
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
