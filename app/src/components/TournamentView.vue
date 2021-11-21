<script setup lang="ts">
import {  computed, ref, onMounted , watch} from "vue";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract"
import { AtButton } from "atmosphere-ui";
import { IAsset } from "../utils/fetchMyItems";
import axios from "axios";
import { useMessage } from "../utils/useMessage";
import TournamentLogo from "./TournamentLogo.vue";
import CombatsTable from "./CombatsTable.vue";
import { ICombat, IPlayer } from "../types";
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

const provider = getProvider();
const RoosterFight = useContract("RoosterFight", provider);
const Tournament = useContract("Tournament", provider);

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

const { setMessage } = useMessage();
const joinTournament = async (prixId: number) => {
    if (AppState.roosters.length === 0) {
        setMessage("You need to have at least one rooster to join a tournament");
        return;
    }
    const tokenId = AppState.roosters[0].tokenId;
    const eventId = await Tournament?.prixToCurrentEvent(prixId);
    const tournamentFee = await Tournament?.getEventFee(eventId);
    const trx = await Tournament?.functions.addParticipant(tokenId, eventId, { value:tournamentFee }).catch((err) => {
        console.log(err);
    }); 
    await trx?.wait();
    setMessage(`You has joined to the ${tournament.value.name} tournament`);
    await fetchPageData();
}

const fight = async (eventId: number, defenderId: number) => {
    const myRoosters = await RoosterFight?.functions.getMyRoosters()
    const tokenId: ethers.BigNumber = myRoosters[0][0];
    const attackerId = players.value.find(p => p.tokenId === tokenId.toNumber())?.playerId;
    if (attackerId === defenderId) {
        setMessage("You cant fight yourself bro");
        return;
    }
    try {
        const event = await Tournament?.events(eventId);
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

const isJoined = ref<boolean>(false);
const currentToken = computed(() => {
    const tokenId = AppState.roosters.length ? AppState.roosters[0]?.tokenId : null;
    return tokenId;
});

const fetchIsJoined = async () => {
    if (!AppState.roosters.length) {
        return false;
    }
    return (await Tournament?.functions.tokenToEvent(currentToken.value, tournament.value.eventId))[0];
}

interface ITournamentWithEvent {
    id: number,
    name: string,
    description: string,
    seats: number,
    eventId: number,
    edition: number,
    startDate: number,
    endDate:  number,
    seatsTaken: number,
    fee: number,
    realFee: number
}

const players = ref<IPlayer[]>([]);
const playerRankings = computed(() => {
    return players.value.sort((a, b) =>  b.points - a.points);
});

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

const combats = ref<ICombat[]>([]);
const fetchMatches = async (eventId: number) => {
    combats.value = await Tournament?.getMatchesForEvent(eventId);
}

const fetchTournament = async () => {
    let prix = await Tournament?.functions.prixes(props.id);
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
    await fetchTournament();
    await fetchPlayers(tournament.value.eventId);
    await fetchMatches(tournament.value.eventId);
    isJoined.value = await fetchIsJoined();
}

watch(
    () => ProviderState.account, 
    async () => {
        await fetchPageData();
    }, 
{ immediate: true });
</script>

<template>
    <div>
        <div class="py-3 text-center bg-gradient-to-b from-purple-700">
            <div class="flex justify-center mb-3"> 
                <TournamentLogo />
            </div>
            <h3 class="text-xl font-bold">{{ tournament.name }}</h3>
            <p>{{ tournament.description }}</p>

            <div>
                <p>Seats: {{ tournament.seatsTaken }} / {{ tournament.seats }}</p>
            </div>
            <p class="mt-5">Fee: {{ tournament.fee }} MATIC</p>
            <AtButton class="bg-purple-500" @click="joinTournament(tournament.id)" v-if="!isJoined">
                Join
            </AtButton>
        </div>

        <div class="py-5">
            <h4> Rankings </h4>
            <div>
                <table class="w-full rounded-md">
                    <thead class="bg-purple-400 border border-gray-500 rounded-md">
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
                        <TournamentViewRow 
                            v-for="(player, index) in playerRankings" 
                            :player="player" 
                            :is-darker="index % 2"
                            :position="index+1"
                            @fight="fight(tournament.eventId, player.playerId)"
                            :current-token-id="currentToken"
                            :is-joined="isJoined"
                        />
                    </tbody>
                </table>
            </div>

            <h4 class="mt-5 mb-5 text-xl font-bold">Combats</h4>
            <CombatsTable :combats="combats" :players="players" />
        </div>
    </div>
</template>
