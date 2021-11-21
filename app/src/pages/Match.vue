<script lang="ts" setup>
import { ethers } from 'ethers';
import { watch, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useContract } from '../composables/useContract';
import { AtButton } from "atmosphere-ui";
import { useMessage } from '../utils/useMessage';
import Game from '../layouts/Game.vue';
import { INftDetails } from '../types';
import { getProvider } from '../composables/getProvider';

const route = useRoute();
const matchId = ref<string>();

const provider = getProvider();
const Cockfighter = useContract("RoosterFight", provider);
const Tournament = useContract("Tournament", provider);

const matchEvent = ref<any>({});
const isFetching = ref(true);

const fetchRooster = async (tokenId: ethers.BigNumber): Promise<INftDetails> => {
    return await Cockfighter?.functions.getDetails(tokenId.toNumber());
};

const fetchMatch = async (matchId: string) => {
    const combat = await Tournament?.combats(matchId);;
    const player1TokenId = await Tournament?.functions?.eventToPlayer(combat.eventId, combat.attacker.toNumber());
    const player2TokenId = await Tournament?.functions?.eventToPlayer(combat.eventId, combat.defense.toNumber());

    const [rooster1, rooster2] = await Promise.all([
        fetchRooster(player1TokenId[0]),
        fetchRooster(player2TokenId[0]),
    ]);

    matchEvent.value = {
        ...combat,
        attackerToken: {
            ...rooster1,
            tokenId: player1TokenId[0].toNumber(),
        },
        defenseToken: {
            ...rooster2,
            tokenId: player2TokenId[0].toNumber(),
        },
    }
    isFetching.value = false;
   
}

const { setMessage, timeout } = useMessage()
const getTokenName = (playerId: number, byToken = false) => {
    let rooster: INftDetails;
    if (!byToken) {
        rooster = matchEvent.value.attacker.toNumber() === playerId ? matchEvent.value.attackerToken : matchEvent.value.defenseToken;
    } else {
        rooster = matchEvent.value.attackerToken.tokenId === playerId ? matchEvent.value.attackerToken : matchEvent.value.defenseToken;
    }
    return rooster.name;
}

const processMatch = async () => {
   const trx = await Tournament?.functions?.startFight(matchEvent.value.requestId, matchId.value)
   const receipt = await trx?.wait();
   if (receipt) {
        const eventDelay = 3000; 
        receipt.events.forEach(async (event: ethers.Event, index: number) => {
            setTimeout(async () => {
                if (event.event == 'FightFinished' && event.args) {
                    const { damage, damageReceived, winner } = event.args;
                    setMessage(`${winner} won the fight. You has received ${damageReceived} and attack caused ${damage}`, eventDelay);
                    if (matchId.value) {
                        await fetchMatch(matchId.value);
                    }
                } else if (event.event == 'FightWinner' && event.args) {
                    const { winner } = event.args;
                    const tokenName = getTokenName(winner, true);
                    setMessage(`${tokenName} won the fight. You has received ${damageReceived} and attack caused ${damage}`, eventDelay);
                } else if (event.args) {
                    const {  attacker, damage } = event.args;
                    const tokenName = getTokenName(attacker.toNumber());
                    setMessage(`${tokenName} goes for its opponent... ${damage}`, eventDelay / 2);
                    setMessage(`${tokenName} cause a damage of ${damage} on its opponent`, eventDelay / 2);
                }
            }, eventDelay * (index + 1));
        });
   }
}

const winnerToken = computed(() => {
    if (matchEvent.value.winner.toNumber() === matchEvent.value.attackerToken.tokenId) {
        return matchEvent.value.attackerToken;
    }
    return matchEvent.value.winner.toNumber() !== 0 ? matchEvent.value.defenseToken : null;
});

watch(() => route.path, () => {
  if (route.params.id && typeof route.params.id == 'string') {
    matchId.value = route.params.id;
    fetchMatch(matchId.value);
  }
}, {immediate: true });
</script>

<template>
<Game :show-navbar="false">
    <div class="flex flex-col items-center justify-center w-full">
        <h4 class="mb-20 text-5xl font-bold text-purple-400"> Tournament Match </h4>
        <div class="relative bg-green-500 rounded-full w-96 h-96">
            <div class="absolute flex flex-col items-center justify-center w-full h-full" v-if="!isFetching">
                <div class="flex items-center justify-center w-full space-x-10">
                    <div class="w-full text-center">
                        <img :src="matchEvent.attackerToken.image" class="attacker h-52">
                        <p>{{ matchEvent.attackerToken.name }}</p>
                    </div>
                    <span class="text-5xl text-white animate-pulse">
                        vs
                    </span>
                    <div class="w-full text-center">
                        <img :src="matchEvent.defenseToken.image" class="h-52">
                        <p>{{ matchEvent.defenseToken.name }}</p>
                    </div>
                </div>
                <AtButton  
                    @click="processMatch()"
                    :disabled="!matchEvent.active" 
                    class="mt-10 text-white bg-purple-500"
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
    </div>
</Game>
</template>

<style>
.attacker {
    transform: rotateY(180deg);
}
</style>

