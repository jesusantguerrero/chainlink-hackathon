<script setup lang="ts">
import { PropType } from '@vue/runtime-core';
import { format } from 'date-fns';
import { ethers } from 'ethers';
import { ICombat, IPlayer } from '../types';
import PlayerMiniCard from './PlayerMiniCard.vue';

const props = defineProps({
    combats: {
        type: Array as PropType<ICombat[]>,
        required: true,
    },
    players: {
        type: Array as PropType<IPlayer[]>,
        required: true,
    },
});

const getPlayer = (playerId: ethers.BigNumber): IPlayer|undefined => {
    return props.players.find((player: IPlayer) => player.playerId === playerId.toNumber());
};

const formatDate = (date: Date|number): string => {
    return format(date || new Date(), 'dd MMM, yyyy HH:mm:ss');
};

const isWinner = (combat: ICombat, playerId: ethers.BigNumber): boolean => {
    const player = getPlayer(playerId);
    return combat.winner && player ? combat.winner.toNumber() === player.tokenId : false;
};
</script>

<template>
<div class="px-5 py-2 mb-10 space-y-2 bg-gray-600 rounded-md">
    <div class="flex mb-5 font-bold">
        <div class="w-6/12">
            Roosters
        </div>
        <div class="w-3/12">
            Date
        </div>
        <div class="w-3/12">
            Location
        </div>
    </div>
    <div v-for="(combat, index) in combats" :key="index" class="flex">
        <router-link class="flex items-center w-6/12 space-x-2 font-bold text-gray-300" :to="`/match/${combat.token}`">
            <PlayerMiniCard :player="getPlayer(combat.attacker)" :marked="isWinner(combat, combat.attacker)" />
            <span class="px-3">
                VS 
            </span>
            <PlayerMiniCard :player="getPlayer(combat.defense)" :marked="isWinner(combat, combat.defense)" />
        </router-link>
        <div class="w-3/12">
            {{ formatDate(combat.date) }}
        </div>
        <div class="w-3/12">
            <router-link :to="`/match/${combat.token}`" class="flex items-center font-bold hover:text-primary-400"> 
                View details <i class="ml-5 fa fa-chevron-right"></i>
            </router-link>
        </div>
    </div>
</div>
</template>