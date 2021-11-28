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
        <div class="relative mt-32 bg-green-500 rounded-full w-96 h-96">
            <div class="absolute flex flex-col items-center justify-center w-full h-full" v-if="!isFetching">
                <div class="flex items-center justify-center w-full space-x-10">
                    
                    <MatchRoosterCard :rooster="matchEvent.attackerToken" :is-attacker="true" />
                    <span class="text-5xl text-white animate-pulse">
                        vs
                    </span>
                    <MatchRoosterCard :rooster="matchEvent.defenseToken"  />
                </div>
                <AtButton  
                    @click="$emit('processMatch')"
                    :disabled="!matchEvent.active" 
                    class="mt-10 text-white bg-primary"
                    v-if="matchEvent.active"
                > 
                    Fight  
                </AtButton>

                <div v-if="winnerToken" class="mt-5 text-center text-white">
                    <p class="font-bold">
                        Winner: {{ winnerToken.name }}
                    </p> 
                    <img :src="winnerToken.image" class="transform rounded-md h-52">
                </div>
            </div>
        </div>
        <MatchPresentation v-if="matchEvent.active" />
    </div>
</template>