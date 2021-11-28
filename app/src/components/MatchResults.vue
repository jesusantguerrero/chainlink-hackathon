<script lang="ts" setup>
import { PropType } from 'vue';
import { ICombat, INftDetails } from '../types';
import { AtButton } from 'atmosphere-ui';
import MatchPresentation from './animated/MatchPresentation.vue';
import MatchRoosterCard from './MatchRoosterCard.vue';

defineProps({
    matchEvent: {
        type: Object as PropType<ICombat>,
        required: true
    },
    winnerToken: {
        type: Object as PropType<INftDetails>,
    },
    isFetching: {
        type: Boolean,
        required: true
    },
})
</script>

<template>
<div class="flex flex-col items-center justify-center w-full">
        <div class="flex w-full space-x-4">
            <div @click="$emit('reply')" class="w-full py-10 mt-5 text-lg font-bold text-center bg-gray-700 border-4 border-gray-600 rounded-md cursor-pointer hover:text-primary hover:border-primary">
                Reply
            </div>
            <div class="w-full py-10 mt-5 text-lg font-bold text-center bg-gray-700 border-4 border-gray-600 rounded-md cursor-pointer hover:text-primary hover:border-primary">
                See logs
            </div>
        </div>

        <div class="relative w-full h-64 mt-5 overflow-hidden bg-gray-700 border-4 border-gray-600 rounded-md">
            <div class="absolute top-0 left-0 z-20 flex w-full">
                <MatchRoosterCard :rooster="matchEvent.attackerToken" :is-attacker="true" />
                <MatchRoosterCard :rooster="matchEvent.defenseToken" />
            </div>
            <div class="absolute w-7/12 h-full transform skew-x-12 bg-gray-800 -left-5"></div>
        </div>
        <div class="relative w-full h-64 mt-5 overflow-hidden bg-gray-700 border-4 rounded-md border-primary">
            <div class="absolute top-0 left-0 z-20 flex w-full">
                <MatchRoosterCard :rooster="winnerToken" :is-attacker="true" class="w-8/12" />
                <div class="w-4/12">
                    <div class="mx-auto">
                        <p>
                            <span class="font-bold capitalize">{{ matchEvent.attackerToken.name }}</span> caused {{ matchEvent.logs.attackerDamage }} damage to {{ matchEvent.defenseToken.name }}
                        </p>
                        <p>
                            {{ matchEvent.defenseToken.name }} caused {{ matchEvent.logs.defenseDamage }} damage to  {{ matchEvent.attackerToken.name }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="absolute z-10 w-6/12 h-full transform skew-x-12 bg-gray-800 -left-5"></div>
            <div class="absolute w-7/12 h-full transform skew-x-12 bg-opacity-25 bg-primary-500 -left-5"></div>
        </div>
    </div>
</template>