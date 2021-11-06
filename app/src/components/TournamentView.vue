<script setup lang="ts">
import {  ref } from "@vue/reactivity";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts"
import { AtButton } from "atmosphere-ui";
import { onMounted } from "@vue/runtime-core";
import { IAsset } from "../utils/fetchMyItems";
import axios from "axios";

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const { Tournament, Cockfighter } = getContracts(signer);

const joinTournament = async (prixId: number) => {
    const myRoosters = await Cockfighter?.functions.getMyRoosters();
    if (myRoosters.length === 0) {
        alert("You need to have at least one rooster to join a tournament");
        return;
    }
    const tokenId: ethers.BigNumber = myRoosters[0][0];
    const eventId = await Tournament?.prixToCurrentEvent(prixId);
    const tournamentFee = await Tournament?.getEventFee(eventId);
    const trx = await Tournament?.functions.addParticipant(tokenId, eventId, { value:tournamentFee }); 
    const receipt = await trx?.wait();
    const name = receipt?.events?.NewPrix?.returnValues?.name;
    alert(`You has joined to the ${name} tournament`);
    await fetchTournament();
}

const fight = async (eventId: number, defenderId: number) => {
    const myRoosters = await Cockfighter?.functions.getMyRoosters()
    const tokenId: ethers.BigNumber = myRoosters[0][0];
    const attackerId = players.value.find(p => p.tokenId === tokenId.toNumber())?.playerId;
    if (attackerId === defenderId) {
        alert("You need to have at least one rooster to join a tournament");
        return;
    }
    const trx = await Tournament?.functions.prepareFight(eventId, attackerId, defenderId);
    const receipt = await trx?.wait();
    const name = receipt?.events?.NewPrix?.returnValues?.name;
    alert(`The fight is going to take place in a minute`);
    await fetchTournament();
}
interface IPlayer {
    playerId: number;
    tokenId: number;
    name: string;
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

const players = ref<IPlayer[]>([]);

const fetchPlayers = async (eventId: number) => {
    const playersData = await Tournament?.getEventParticipants(eventId);
    players.value = await Promise.all(playersData.map(async (player: any) => {
        const tokenURI = await Cockfighter?.functions.tokenURI(player.tokenId);
        const rooster = await axios(tokenURI[0])
        .then(({ data } : { data: IAsset}): IAsset => data)
        .catch(err => {
            console.log(err)
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

const combats = ref<any[]>([]);
const fetchMatches = async (eventId: number) => {
    combats.value = await Tournament?.getEventCombats(eventId);
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
        eventId: currentEvent.tokenId,
        edition: currentEvent.tournamentEdition,
        startDate: currentEvent.startDate,
        endDate:  currentEvent.endDate,
        seatsTaken: currentEvent.seatsTaken,
        fee: ethers.utils.formatEther(prix.seatFee),
        realFee: prix.seatFee
    }

    tournament.value = prix;
}


onMounted(async () => {
    await fetchTournament();
    await fetchPlayers(tournament?.value?.eventId);
    fetchMatches(tournament?.value?.eventId);
});


</script>

<template>
    <div>
        <div>
            <h3>{{ tournament.name }} - {{ tournament.id }}{{ tournament.eventId }}</h3>
            <p>{{ tournament.description }}</p>
            <p>Seats: {{ tournament.seats }}</p>
            <p>Participants: {{ tournament.seatsTaken }}</p>
            <p>Fee: {{ tournament.fee }}</p>
            <AtButton class="bg-purple-500" @click="joinTournament(tournament.id)">
                Join
            </AtButton>
        </div>

        <h4> Rankings </h4>
        <div>
            <table class="rounded-md">
                <thead>
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
                    <tr v-for="(player, index) in players">
                        <td class="px-4 py-2 border">{{ index + 1 }}</td>
                        <td class="flex flex-col px-4 py-2 border">
                            <img :src="player.image" alt="" class="rounded-md w-28 h-28">
                            <span>{{ player.name }}</span>
                            <AtButton 
                                class="font-bold bg-purple-400" 
                                @click="fight(tournament.eventId, player.playerId)"> 
                                Fight 
                            </AtButton>
                        </td>
                        <td class="px-4 py-2 border">{{ player.record.wins }}</td>
                        <td class="px-4 py-2 border">{{ player.record.losses }}</td>
                        <td class="px-4 py-2 border">{{ player.record.draws }}</td>
                        <td class="px-4 py-2 border">{{ player.points }}</td>
                        <td class="px-4 py-2 border">{{ player.owner }}</td>
                        
                    </tr>
                </tbody>
            </table>
        </div>

        <h4 class="mt-5">Combats</h4>
        <div>
            <div v-for="(combat, index) in combats">
                {{index + 1}} - {{combat.attacker}} vs {{ combat.defence }}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.form-group {
    margin-bottom: 1rem;
    @apply flex flex-col;
}

.form-control {
    @apply text-gray-700 rounded-md py-1 px-2;
}
</style>
