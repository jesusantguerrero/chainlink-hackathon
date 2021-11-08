<script lang="ts" setup>
import axios from 'axios';
import { ethers } from 'ethers';
import { watch, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getContracts } from '../composables/getContracts';
import { IAsset } from '../utils/fetchMyItems';
import { AtButton } from "atmosphere-ui";

const route = useRoute();
const matchId = ref<string>();

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const { Tournament, Cockfighter } = getContracts(signer);

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

const processMatch = async () => {
   const trx = await Tournament?.functions?.startFight(matchEvent.value.requestId, matchId.value)
   const receipt = await trx?.wait();
   console.log(receipt.events);
   if (matchId.value) {
       await fetchMatch(matchId.value);
   }
}

const winnerToken = computed(() => {
    if (matchEvent.value.winner === matchEvent.value.attackerToken.tokenId) {
        return matchEvent.value.attackerToken;
    }
    return matchEvent.value.winner ? matchEvent.value.defenseToken : { };
});

watch(() => route.path, () => {
  if (route.params.id && typeof route.params.id == 'string') {
    matchId.value = route.params.id;
    fetchMatch(matchId.value);
  }
}, {immediate: true });
//  public/private rooster view
/**
 * 
 * gameplay start animations
 * - Show the cards with the data
 * - Show the details of the match preview
 * - Show the match: 
 * 
 */


</script>

<template>
<div class="flex flex-col items-center justify-center w-full h-screen">
    <h4 class="mb-5 text-5xl font-bold text-purple-400"> Tournament Match </h4>
    <div class="relative bg-green-500 rounded-full w-96 h-96">
        <div class="absolute flex flex-col items-center justify-center w-full h-full" v-if="!isFetching">
            <div class="flex items-center justify-center w-full space-x-10">
                <img :src="matchEvent.attackerToken.image" class="transform rounded-md shadow-lg h-52 skew-y-2">
                <span class="text-5xl text-white animate-pulse">
                    vs
                </span>
                <img :src="matchEvent.defenseToken.image" class="transform rounded-md shadow-lg h-52 skew-x-2">
            </div>
            <AtButton  
                @click="processMatch()"
                :disabled="matchEvent.active" 
                class="mt-10 text-white bg-purple-500"
                v-if="matchEvent.active"
            > 
                Fight  
            </AtButton>

            <div v-if="matchEvent.winner" class="mt-5 text-white">
                Winner: {{ winnerToken.name }}
                <img :src="winnerToken.image" class="transform rounded-md shadow-lg h-52">
            </div>
        </div>
    </div>
</div>
</template>

