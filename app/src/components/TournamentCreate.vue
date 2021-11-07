<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts"
import { AtButton } from "atmosphere-ui";
import { onMounted } from "@vue/runtime-core";
import EventCreate from "./EventCreate.vue";

interface ITournament {
    name: string;
    description: string;
    seats: number;
    fee: number;
}

const form = reactive<ITournament>({
    name: "",
    description: "",
    seats: 0,
    fee: 0
});

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const { Tournament } = getContracts(signer);

const createTournament = async (formData: ITournament) => {
    const trx = await Tournament?.functions.addPrix(formData.name, formData.description, formData.seats, 
    ethers.utils.parseEther(formData.fee.toString()));
    const receipt = await trx?.wait();
    const name = receipt?.events?.NewPrix?.returnValues?.name;
    alert(`Tournament ${name} has been created`);
    await fetchTournaments();
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
    <form className="form" @submit.prevent="createTournament(form)">
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" v-model="form.name">
        </div>
        <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" className="form-control" id="description" v-model="form.description">
        </div>
        <div className="form-group">
            <label htmlFor="seats">Seats</label>
            <input type="number" className="form-control" id="seats" v-model="form.seats">
        </div>
        <div className="form-group">
            <label htmlFor="fee">Fee</label>
            <input type="number" className="form-control" id="fee" v-model="form.fee">
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

    <EventCreate :tournaments="tournaments" />
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
