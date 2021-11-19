<script setup lang="ts">
import {  computed, ref, onMounted } from "vue";
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

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const Cockfighter = useContract("RoosterFight", signer);
const Tournament = useContract("Tournament", signer);

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

const joinTournament = async (prixId: number) => {
    const myRoosters = await Cockfighter?.functions.getMyRoosters();
    if (myRoosters.length === 0) {
        alert("You need to have at least one rooster to join a tournament");
        return;
    }
    const tokenId: ethers.BigNumber = myRoosters[0][0];
    const eventId = await Tournament?.prixToCurrentEvent(prixId);
    const tournamentFee = await Tournament?.getEventFee(eventId);
    const trx = await Tournament?.functions.addParticipant(tokenId, eventId, { value:tournamentFee }).catch((err) => {
        console.log(err);
    }); 
    const receipt = await trx?.wait();
    const name = receipt?.events?.NewPrix?.returnValues?.name;
    alert(`You has joined to the ${tournament.value.name} tournament`);
    await fetchPageData();
}

const { setMessage } = useMessage();
const fight = async (eventId: number, defenderId: number) => {
    const myRoosters = await Cockfighter?.functions.getMyRoosters()
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
        const tokenURI = await Cockfighter?.functions.tokenURI(player.tokenId);
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
}
onMounted(async () => {
    await fetchPageData();
});
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
            <AtButton class="bg-purple-500" @click="joinTournament(tournament.id)">
                Join
            </AtButton>
        </div>

        <div class="px-5 py-5">
            <h4> Rankings </h4>
            <div>
                <table class="w-full rounded-md">
                    <thead class="bg-purple-400 border border-gray-500 rounded-md">
                        <tr>
                            <th class="px-4 py-2">Rank</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Wins</th>
                            <th class="px-4 py-2">Loses</th>
                            <th class="px-4 py-2">Draws</th>
                            <th class="px-4 py-2">Points</th>
                            <th class="px-4 py-2">Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, index) in playerRankings" class="border border-gray-500" :class="{'bg-gray-600': index % 2}">
                            <td class="px-4 py-2 ">{{ index + 1 }}</td>
                            <td class="px-4 py-2">
                            <div class="flex">
                                <img :src="player.image" alt="" class="w-20 h-20 rounded-md">
                                <div class="ml-2">
                                    <p class="capitalize">{{ player.name }}</p>
                                    <AtButton 
                                        class="font-bold bg-purple-400" 
                                        @click="fight(tournament.eventId, player.playerId)"> 
                                        Fight 
                                    </AtButton>
                                </div>
                            </div>
                            </td>
                            <td class="px-4 py-2">{{ player.record.wins }}</td>
                            <td class="px-4 py-2">{{ player.record.losses }}</td>
                            <td class="px-4 py-2">{{ player.record.draws }}</td>
                            <td class="px-4 py-2">{{ player.points }}</td>
                            <td class="px-4 py-2">{{ player.owner }}</td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4 class="mt-5 mb-5 text-xl font-bold">Combats</h4>
            <CombatsTable :combats="combats" :players="players" />
        </div>
    </div>
</template>
