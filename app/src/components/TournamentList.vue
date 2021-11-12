<script setup lang="ts">
import {  ref } from "@vue/reactivity";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract"
import { AtButton } from "atmosphere-ui";
import { onMounted } from "@vue/runtime-core";
import { useMessage } from "../utils/useMessage";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const Cockfighter = useContract("RoosterFight", signer);
const Tournament = useContract("Tournament", signer);

const { setMessage } = useMessage();
const joinTournament = async (prixId: number, prixName: string) => {
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
    setMessage(`You has joined to the ${prixName} tournament`);
    await fetchTournaments();
}

const tournaments = ref([]);
const fetchTournaments = async () => {
    let prixes = await Tournament?.functions.getPrixes();
    prixes = await Promise.all(prixes[0]?.map(async (t:any) => {

        const currentEventId = await Tournament?.prixToCurrentEvent(t.tokenId);
        const currentEvent = await Tournament?.events(currentEventId);

        return {
            id: t.tokenId,
            name: t.name,
            description: t.description,
            seats: t.seatsLimit,
            eventId: currentEvent.tokenId,
            edition: currentEvent.tournamentEdition,
            startDate: currentEvent.startDate,
            endDate:  currentEvent.endDate,
            seatsTaken: currentEvent.seatsTaken,
            fee: ethers.utils.formatEther(t.seatFee),
            realFee: t.seatFee
        }
    }));

    tournaments.value = prixes;
}

onMounted(async () => {
    await fetchTournaments();
});


</script>

<template>
    <div>
        <ul class="mt-5 space-y-5 list-group">
            <li class="list-group-item" v-for="tournament in tournaments">
                <router-link :to="`/tournaments/${tournament.id}`">
                    <h3>{{ tournament.name }} - {{ tournament.id }}{{ tournament.eventId }}</h3>
                    <p>{{ tournament.description }}</p>
                    <p>Seats: {{ tournament.seats }}</p>
                    <p>Participants: {{ tournament.seatsTaken }}</p>
                    <p>Fee: {{ tournament.fee }}</p>
                    <AtButton 
                        class="bg-purple-500" 
                        @click.p.prevent.stop="joinTournament(tournament.id, tournament.name)"
                    >
                        Join
                    </AtButton>
                </router-link>
            </li>
        </ul>
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
