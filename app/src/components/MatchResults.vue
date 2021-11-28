<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { ICombat, INftDetails } from '../types';
import MatchRoosterCard from './MatchRoosterCard.vue';
import MatchLogItem from './MatchLogItem.vue';

const props = defineProps({
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

const showLogs= ref(false);
const logVars = computed(() => {
    return {
        attackerName: props.matchEvent.attackerToken.name,
        attackerDamage: props.matchEvent.logs.attackerDamage,
        defenseDamage: props.matchEvent.logs.attackerDamage,
        defenseName: props.matchEvent.defenseToken.name
    }
})
</script>

<template>
<div class="flex flex-col items-center justify-center w-full">
        <div class="flex w-full space-x-4">
            <div @click="$emit('reply')" class="w-full py-10 mt-5 text-lg font-bold text-center bg-gray-700 border-4 border-gray-600 rounded-md cursor-pointer hover:text-primary hover:border-primary">
                Reply
            </div>
            <div @click="showLogs=!showLogs" class="w-full py-10 mt-5 text-lg font-bold text-center bg-gray-700 border-4 border-gray-600 rounded-md cursor-pointer hover:text-primary hover:border-primary">
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
                <div class="w-5/12 h-full mx-auto my-auto" v-if="showLogs">
                    <div class="h-full">
                        <MatchLogItem 
                            template="${attackerName} caused ${attackerDamage} damage to ${defenseName}"
                            :vars="logVars"
                        />
                        <MatchLogItem 
                            template="${defenseName} caused ${defenseDamage} damage to ${attackerName}"
                            :vars="logVars"
                        />
                       
                    </div>
                </div>
            </div>
            <div class="absolute z-10 w-6/12 h-full transform skew-x-12 bg-gray-800 -left-5"></div>
            <div class="absolute w-7/12 h-full transform skew-x-12 bg-opacity-25 bg-primary-500 -left-5"></div>
        </div>
    </div>
</template>