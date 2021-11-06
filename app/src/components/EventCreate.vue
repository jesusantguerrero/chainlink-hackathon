<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts"
import { AtButton, AtDateSelect } from "atmosphere-ui";
import { onMounted } from "@vue/runtime-core";

interface ITournamentEvent {
    tournamentId: ethers.BigNumber;
    startDate: Date;
    endDate: Date;
}

const form = reactive<ITournamentEvent>({
    tournamentId: ethers.BigNumber.from(0),
    startDate: new Date(),
    endDate: new Date(),
});

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const { Tournament } = getContracts(signer);

const createEvent = async (formData: ITournamentEvent) => {
    
    const trx = await Tournament?.functions.addEvent( formData.tournamentId.toNumber(), formData.startDate.getTime(), formData.endDate.getTime());
    alert(`Tournament event has been created`);
}

const tournaments = ref([]);
const fetchTournaments = async () => {
    let prixes = await Tournament?.functions.getPrixes();
    prixes = prixes[0]?.map((t:any) => {
        return {
            id: t.tokenId,
            name: t.name,
            description: t.description,
            seats: t.seats,
            fee: ethers.utils.formatEther(t.seatFee),
            realFee: t.seatFee
        }
    });

    tournaments.value = prixes;
}

onMounted(async () => {
    await fetchTournaments();
});


</script>

<template>
    <form className="form" @submit.prevent="createEvent(form)">
        <div className="form-group">
            <label htmlFor="name">Tournament</label>
            <select v-model="form.tournament" class="form-control">
                <option  v-for="tournament in tournaments">
                    {{ tournament.name }}
                </option>
            </select>
        </div>
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <AtDateSelect v-model="form.startDate" />
        </div>
        <div className="form-group">
            <label htmlFor="description">Description</label>
            <AtDateSelect v-model="form.endDate" />
        </div>

        <div class="text-right">
        <AtButton class="bg-purple-500 hover:bg-purple-600">
            Create
        </AtButton>
        </div>
    </form>

    <div>
        <h2 class="mb-5"> Tournaments </h2>
        <ul class="space-y-5 list-group">
            <li class="list-group-item" v-for="tournament in tournaments">
                <div>
                    <h3>{{ tournament.name }}</h3>
                    <p>{{ tournament.description }}</p>
                    <p>Seats: {{ tournament.seats }}</p>
                    <p>Fee: {{ tournament.fee }}</p>
                </div>
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
