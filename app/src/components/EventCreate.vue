<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts"
import { AtButton, AtDateSelect } from "atmosphere-ui";

defineProps({
    tournaments: {
        type: Array,
        default: () => []
    },
});

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
</script>

<template>
    <form className="form" @submit.prevent="createEvent(form)">
        <h2 class="mt-5 text-xl font-bold text-purple-400">Create Event for this tournament</h2>
        <div className="form-group mt-5">
            <label htmlFor="name">Tournament</label>
            <select v-model="form.tournamentId" class="form-control">
                <option  v-for="tournament in tournaments" :value="tournament.id">
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
    </form>s
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
