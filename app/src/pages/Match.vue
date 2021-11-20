<script lang="ts" setup>
import axios from 'axios';
import { ethers } from 'ethers';
import { watch, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useContract } from '../composables/useContract';
import { IAsset } from '../utils/fetchMyItems';
import { AtButton } from "atmosphere-ui";
import { useMessage } from '../utils/useMessage';

const route = useRoute();
const matchId = ref<string>();

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const Cockfighter = useContract("RoosterFight", signer);
const Tournament = useContract("Tournament", signer);

const matchEvent = ref<any>({});
const isFetching = ref(true);

const fetchRooster = async (tokenId: ethers.BigNumber) => {
    const tokenURI = await Cockfighter?.functions.tokenURI(tokenId.toNumber());
    const rooster = await axios(tokenURI[0])
    .then(({ data } : { data: IAsset}): IAsset => data)
    .catch(() => {
        return {};
    });
    return rooster; 
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
                    const { damage, damageReceived, winnerName } = event.args;
                    setMessage(`${winnerName} won the fight. You has received ${damageReceived} and attack caused ${damage}`, eventDelay);
                } else if (event.args) {
                    const { tokenName, damage, message } = event.args;
                    setMessage(`${tokenName} ${message} ${damage}`, eventDelay);
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
<div class="flex flex-col items-center justify-center w-full h-screen">
    <h4 class="mb-5 text-5xl font-bold text-purple-400"> Tournament Match </h4>
    <div class="relative bg-green-500 rounded-full w-96 h-96">
        <div class="absolute flex flex-col items-center justify-center w-full h-full" v-if="!isFetching">
            <div class="flex items-center justify-center w-full space-x-10">
                <img :src="matchEvent.attackerToken.image" class="attacker h-52">
                <span class="text-5xl text-white animate-pulse">
                    vs
                </span>
                <img :src="matchEvent.defenseToken.image" class="h-52">
            </div>
            <AtButton  
                @click="processMatch()"
                :disabled="!matchEvent.active" 
                class="mt-10 text-white bg-purple-500"
                v-if="matchEvent.active"
            > 
                Fight  
            </AtButton>

            <div v-if="winnerToken" class="mt-5 text-white">
                Winner: {{ winnerToken.name }}
                <img :src="winnerToken.image" class="transform rounded-md h-52">
            </div>
        </div>
    </div>
</div>
</template>

<style>
.attacker {
    transform: rotateY(180deg);
}
</style>

