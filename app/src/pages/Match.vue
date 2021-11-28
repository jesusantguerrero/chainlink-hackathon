<script lang="ts" setup>
import { ethers } from 'ethers';
import { watch, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useContract } from '../composables/useContract';
import { useMessage } from '../utils/useMessage';
import Game from '../layouts/Game.vue';
import { ICombat, INftDetails, ITournamentWithEvent } from '../types';
import { getProvider } from '../composables/getProvider';
import { AppState } from '../composables/AppState';
import MatchLive from '../components/MatchLive.vue';
import MatchResults from '../components/MatchResults.vue';

const route = useRoute();
const matchId = ref<string>();

const provider = getProvider();
const RoosterFight = useContract("RoosterFight", provider);
const Tournament = useContract("Tournament", provider);

const matchEvent = ref<any>({});
const isFetching = ref(true);

const fetchRooster = async (tokenId: ethers.BigNumber): Promise<INftDetails> => {
    return await RoosterFight?.functions.getDetails(tokenId.toNumber());
};

const fetchMatch = async (matchId: string) => {
    const combat: ICombat = await Tournament?.combats(matchId);;
    const player1TokenId = await Tournament?.eventToPlayer(combat.eventId, combat.attacker.toNumber());
    const player2TokenId = await Tournament?.eventToPlayer(combat.eventId, combat.defense.toNumber());

    const [rooster1, rooster2] = await Promise.all([
        fetchRooster(player1TokenId),
        fetchRooster(player2TokenId),
    ]);

    matchEvent.value = {
        ...combat,
        attackerToken: {
            ...rooster1,
            tokenId: player1TokenId.toNumber(),
        },
        defenseToken: {
            ...rooster2,
            tokenId: player2TokenId.toNumber(),
        },
        logs: combat.active ? [] : await Tournament?.combatLogs(matchId, combat.attacker, combat.defense),
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

const runFight = async (actions: any[], eventDelay: number = 6000, callback: Function) => {
    const damages = []
    isFetching.value = true;
    actions.forEach(async (event: ethers.Event, index: number) => {
    setTimeout(async () => {
        if (event.event == 'FightFinished' && event.args) {
            const { winner } = event.args;
            const tokenName = getTokenName(winner, true);
            setMessage(`after an intense fight ${tokenName} won the fight. the Attacker has received ${damages[1]} and attack caused ${damages[0]}`, eventDelay);
            callback();
        } else if (event.args) {
            isFetching.value = false;
            const {  attacker, damage } = event.args;
            const tokenName = getTokenName(attacker.toNumber());
            damages.push(damage);
            setMessage(`${tokenName} goes for its opponent...`, eventDelay / 2);
            setTimeout(() => {
                setMessage(`${tokenName} cause a damage of ${damage} on its opponent`, eventDelay / 2);
            }, eventDelay / 2);
        }
    }, eventDelay * index);
});
}

const isReplay = ref(false);
const replayFight = async () => {
    if (isReplay.value) {
        return;
    }
    isReplay.value = true;
    const actions = [{
        args: {
            attacker: matchEvent.value.attacker,
            damage: matchEvent.value.logs.attackerDamage,
        }
    }, {
        args: {
            attacker: matchEvent.value.defense,
            damage: matchEvent.value.logs.defenseDamage,
        }
    }, {
        event: 'FightFinished',
        args: {
            winner: matchEvent.value.winner,
        }
    }];
    await runFight(actions, 6000, () => {
        isReplay.value = false;
    });
}

const processMatch = async () => {
   if (!AppState.signer) return;
   const Tournament = useContract("Tournament", AppState.signer);
   const trx = await Tournament?.functions?.startFight(matchEvent.value.requestId, matchId.value)
   const receipt = await trx?.wait();
   if (receipt) {
        runFight(receipt.events, 6000, () => {
            isFetching.value = true;
            fetchMatch(matchId.value);
        });
   }
}

const winnerToken = computed(() => {
    if (matchEvent.value.winner.toNumber() === matchEvent.value.attackerToken.tokenId) {
        return matchEvent.value.attackerToken;
    }
    return matchEvent.value.winner.toNumber() !== 0 ? matchEvent.value.defenseToken : null;
});

const tournament = ref<ITournamentWithEvent>();
const fetchEventTournament = async (eventId: number) => {
    let currentEvent = await Tournament?.events(eventId);
    let prix = await Tournament?.prixes(currentEvent.prixId);

    prix = {
        id: prix.tokenId,
        name: prix.name,
        description: prix.description,
        seats: prix.seatsLimit,
        eventId: currentEvent.tokenId.toNumber(),
        edition: currentEvent.tournamentEdition,
        startDate: currentEvent.startDate,
        endDate:  currentEvent.endDate,
        seatsTaken: currentEvent.seatsTaken,
        fee: ethers.utils.formatEther(prix.seatFee),
        realFee: prix.seatFee,
        formattedPrize: ethers.utils.formatEther(prix.prize),
        prize: prix.prize
    }

    tournament.value = prix;
}

const isLoading = ref(false);
watch(() => route.path, async () => {
  if (route.params.id && typeof route.params.id == 'string') {
    matchId.value = route.params.id;
    isLoading.value = true;
    await fetchMatch(matchId.value);
    await fetchEventTournament(matchEvent.value.eventId);
    isLoading.value = false;
  }
}, {immediate: true });
</script>

<template>
<Game :show-navbar="false">
    <div class="flex justify-between" v-if="tournament">
        <div class="flex items-center space-x-3 " >
            <RouterLink :to="`/tournaments/${tournament.id}`" class="flex items-center hover:text-primary">
                <i class="fa fa-chevron-left"></i>
                <h4 class="ml-4 text-xl font-bold">
                {{ tournament.name }}: <span class="text-gray-300">{{ tournament.description }}</span></h4>
            </RouterLink>
        </div>
        <div>Prizepool: <span class="text-xl font-bold text-roti">{{ tournament.formattedPrize }} MATIC</span></div>
    </div>
    <MatchLive 
        v-if="matchEvent.active" @processMatch="processMatch" 
        :match-event="matchEvent" :is-fetching="isFetching" 
        :winner-token="winnerToken"
    />
    <MatchLive 
        v-else-if="isReplay" 
        @processMatch="processMatch" 
        :match-event="matchEvent" 
        :is-fetching="isFetching" 
        :is-replay="isReplay"
        :winner-token="winnerToken"
    />
    <MatchResults 
        v-else="matchEvent.active" 
        @reply="replayFight()" 
        :match-event="matchEvent" :is-fetching="isFetching" 
        :winner-token="winnerToken"
    />
    
</Game>
</template>

<style>
.attacker {
    transform: rotateY(180deg);
}
</style>

