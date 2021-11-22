<script setup lang="ts">
import {  ref } from "@vue/reactivity";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract"
import { AtButton } from "atmosphere-ui";
import { onMounted } from "@vue/runtime-core";
import { useMessage } from "../utils/useMessage";
import { format } from "date-fns";
import TournamentLogo from "./TournamentLogo.vue";
import { getProvider } from "../composables/getProvider";
import { AppState } from "../composables/AppState";

const provider = getProvider();
const Cockfighter = useContract("RoosterFight", provider);
const Tournament = useContract("Tournament", provider);

const { setMessage } = useMessage();
const joinTournament = async (prixId: number, prixName: string) => {
    const SignedRoosterFight = useContract("RoosterFight", AppState.signer);
    const Tournament = useContract("Tournament", AppState.signer);
    const myRoosters = await SignedRoosterFight?.functions.getMyRoosters();
    if (myRoosters.length === 0) {
        alert("You need to have at least one rooster to join a tournament");
        return;
    }
    const tokenId: ethers.BigNumber = myRoosters[0][0];
    const eventId = await Tournament?.prixToCurrentEvent(prixId);
    const tournamentFee = await Tournament?.getEventFee(eventId);
    const trx = await Tournament?.addParticipant(tokenId, eventId, { value:tournamentFee }); 
    await trx?.wait();
    setMessage(`You has joined to the ${prixName} tournament`);
    await fetchTournaments();
}

const isLoading = ref(true);
const tournaments = ref([]);
const fetchTournaments = async () => {
    isLoading.value = true;
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
            startDate: currentEvent.startDate.toNumber(),
            endDate:  currentEvent.endDate.toNumber(),
            prixId:  currentEvent.tokenId,
            formattedPrize: ethers.utils.formatEther(t.prize),
            prize: t.prize,
            seatsTaken: currentEvent.seatsTaken,
            fee: ethers.utils.formatEther(t.seatFee),
            realFee: t.seatFee
        }
    }));

    isLoading.value = false;
    tournaments.value = prixes;
}

onMounted(async () => {
    await fetchTournaments();
});


</script>

<template>
    <div class="mt-10 text-4xl text-center text-white" v-if="isLoading">
        <i class=" fa fa-circle-notch fa-spin fa-3x fa-fw" />
    </div>
    <div v-else>
        <ul class="mt-5 space-y-5 list-group">
            <li class="list-group-item" v-for="tournament in tournaments">
                <router-link :to="`/tournaments/${tournament.id}`" class="flex items-center justify-between px-2 py-2 transition bg-gray-600 border-4 border-gray-500 rounded-md hover:border-purple-400 ">
                    <div class="flex tournament__image">
                        <TournamentLogo />
                        <div class="ml-2">
                            <h3>{{ tournament.name }}</h3>
                            <p>{{ tournament.description }}</p>
                            <div>
                                <p class="flex justify-between">Start: <span class="font-bold">{{ format(tournament.startDate, 'yyyy-MM-dd') }}</span></p>
                            <p class="flex justify-between">End: <span class="font-bold">{{ format(tournament.endDate, 'yyyy-MM-dd') }}</span></p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p><i class="fa fa-users"></i>: {{ tournament.seatsTaken }} / {{ tournament.seats }}</p>
                        <p>Fee: {{ tournament.fee }} MATIC</p>
                        <AtButton 
                            class="mt-5 bg-purple-500" 
                            @click.p.prevent.stop="joinTournament(tournament.id, tournament.name)"
                        >
                            Join
                        </AtButton>
                    </div>
                    <div class="w-40 py-2 text-center text-purple-200">
                        <i class="text-7xl fa fa-medal"></i>
                        <p class="text-2xl"><span class="font-bold">{{ tournament.formattedPrize }} MATIC</span></p>
                        <p class="text-xl text-white">Acc. Prize</p>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>
