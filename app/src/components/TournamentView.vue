<script setup lang="ts">
import {  computed, ref, watch} from "vue";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract"
import { AtButton } from "atmosphere-ui";
import { IAsset } from "../types";
import axios from "axios";
import { useMessage } from "../utils/useMessage";
import TournamentLogo from "./TournamentLogo.vue";
import CombatsTable from "./CombatsTable.vue";
import { ICombat, IPlayer, ITournamentWithEvent } from "../types";
import { useFight } from "../composables/useMoralis";
import { AppState } from "../composables/AppState";
import TournamentViewRow from "./TournamentViewRow.vue";
import { ProviderState } from "../composables/useWeb3Provider";
import { getProvider } from "../composables/getProvider";

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

// contracts and utils
const { setMessage } = useMessage();
const provider = getProvider();
const RoosterFight = useContract("RoosterFight", provider);
const Tournament = useContract("Tournament", provider);

// player state
const getPlayerId = (tokenId: number): number => {
   return players.value.find(p => p.tokenId === tokenId)?.playerId
}

const isJoined = ref<boolean>(false);
const currentToken = computed(() => {
    const tokenId = AppState.roosters.length ? AppState.roosters[0]?.tokenId : null;
    return tokenId;
});

const currentPlayerId = computed(() => {
    return getPlayerId(currentToken.value);
});

const fetchIsJoined = async () => {
    if (!AppState.roosters.length) {
        return false;
    }
    return (await Tournament?.functions.tokenToEvent(currentToken.value, tournament.value.eventId))[0];
}

// data fetching
const combats = ref<ICombat[]>([]);
const players = ref<IPlayer[]>([]);
const tournament = ref<ITournamentWithEvent>({
    id: 0,
    name: "",
    description: "",
    seats: 0,
    eventId: 0,
    edition: 0,
    startDate: 0,
    endDate: 0,
    seatsTaken: 0,
    fee: 0,
    realFee: 0
});
const playerRankings = computed(() => {
    return players.value.sort((a, b) =>  b.points - a.points);
});
const isLoading = ref<boolean>(false);

const fetchPlayers = async (eventId: number) => {
    const playersData = await Tournament?.getEventParticipants(eventId);
    players.value = await Promise.all(playersData.map(async (player: any) => {
        const tokenURI = await RoosterFight?.functions.tokenURI(player.tokenId);
        const rooster = await axios(tokenURI[0])
        .then(({ data } : { data: IAsset}): IAsset => data)
        .catch(err => {
          return {};
        });
        
        return {
            ...player,
            playerId: player.playerId.toNumber(),
            tokenId: player.tokenId.toNumber(),
            ...rooster
        }
    }));
}

const fetchMatches = async (eventId: number) => {
    combats.value = await Tournament?.getMatchesForEvent(eventId);
}

const fetchTournament = async () => {
    let prix = await Tournament?.prixes(props.id);
    const currentEventId = await Tournament?.prixToCurrentEvent(prix.tokenId);
    const currentEvent = await Tournament?.events(currentEventId);

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
        realFee: prix.seatFee
    }

    tournament.value = prix;
}

const fetchPageData = async () => {
    isLoading.value = true;
    await fetchTournament();
    await fetchPlayers(tournament.value.eventId);
    await fetchMatches(tournament.value.eventId);
    isJoined.value = await fetchIsJoined();
    isLoading.value = false;
}

watch(
    () => ProviderState.account, 
    async () => {
        await fetchPageData();
    }, 
{ immediate: true });

// Player actions
const fight = async (eventId: number, defenderId: number) => {
    const attackerId = getPlayerId(AppState.roosters[0].tokenId);
    const Tournament = useContract("Tournament", AppState.signer);
    if (attackerId === defenderId) {
        setMessage("You cant fight yourself bro");
        return;
    }
    try {
        const trx = await Tournament?.prepareFight(attackerId, defenderId, eventId)
        const receipt = await trx?.wait(1);
        if (receipt && receipt.events[3].event) {
            const {requestId, attacker, defense, combatId} = receipt.events[3].args;
            const { saveFight } = useFight();
            saveFight(
                requestId,
                combatId.toNumber(), 
                eventId, 
                attacker.toNumber(), 
                defense.toNumber()
            );
            setMessage(`The fight is going to take place in a minute`);
            await fetchMatches(eventId);
        }
    } catch (err: any) {
        const rpcMessage = err?.data?.message || "";
        setMessage(rpcMessage.slice(rpcMessage.indexOf("'")));
    }
}

const canJoin = computed(() => {
    return (tournament.value.seatsTaken < tournament.value.seats) && !isJoined.value && AppState && AppState.roosters.length;
});
const isJoining = ref<boolean>(false);

const joinTournament = async (prixId: number) => {
    if (AppState.roosters.length === 0) {
        setMessage("You need to have at least one rooster to join a tournament");
        return;
    }
    isJoining.value = true;
    const tokenId = AppState.roosters[0].tokenId;
    const Tournament = useContract("Tournament", AppState.signer);
    const eventId = await Tournament?.prixToCurrentEvent(prixId);
    const tournamentFee = await Tournament?.getEventFee(eventId);
    const trx = await Tournament?.functions.addParticipant(tokenId, eventId, { value:tournamentFee }).catch((err) => {
        console.log(err);
    }); 
    await trx?.wait();
    setMessage(`You has joined to the ${tournament.value.name} tournament`);
    isJoining.value = false;
    await fetchPageData();
}

</script>

<template>
    <div>
        <div class="py-3 text-center bg-gradient-to-b from-primary-700">
            <div class="flex justify-center mb-3"> 
                <TournamentLogo />
            </div>
            <h3 class="text-xl font-bold">{{ tournament.name }}</h3>
            <p>{{ tournament.description }}</p>

            <div>
                <p>Seats: {{ tournament.seatsTaken }} / {{ tournament.seats }}</p>
            </div>
            <p class="mt-5 font-bold">Fee: {{ tournament.fee }} MATIC</p>
            <AtButton class="bg-primary-500" @click="joinTournament(tournament.id)" v-if="canJoin" :disabled="isJoining">
                <i class="fa fa-circle-notch fa-spin fa-3x fa-fw"  v-if="isJoining"/>
                Join
            </AtButton>
        </div>

        <div class="py-5">
            <h4> Rankings </h4>
            <div>
                <table class="w-full rounded-md">
                    <thead class="border border-gray-500 rounded-md bg-primary-400">
                        <tr>
                            <th class="px-4 py-2">Rank</th>
                            <th class="px-4 py-2">Rooster</th>
                            <th class="px-4 py-2">Fights</th>
                            <th class="px-4 py-2">Wins</th>
                            <th class="px-4 py-2">Loses</th>
                            <th class="px-4 py-2">Draws</th>
                            <th class="px-4 py-2">Points</th>
                            <th class="px-4 py-2">Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="!isLoading">
                            <TournamentViewRow 
                                v-for="(player, index) in playerRankings" 
                                :player="player" 
                                :is-darker="!!(index % 2)"
                                :position="index+1"
                                @fight="fight(tournament.eventId, player.playerId)"
                                :event-id="tournament.eventId"
                                :current-token-id="currentToken"
                                :player-id="currentPlayerId"
                                :is-joined="isJoined"
                            />
                        </template>
                        <td colspan="8" v-else>
                            <div class="w-full">
                                loading...
                            </div>
                        </td>
                    </tbody>
                </table>
            </div>

            <h4 class="mt-5 mb-5 text-xl font-bold">Combats</h4>
            <CombatsTable :combats="combats" :players="players" />
        </div>
    </div>
</template>
