<script setup lang="ts">
import { reactive, PropType } from "vue";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract"
import { AtButton, AtDateSelect } from "atmosphere-ui";
import { ITournamentWithEvent } from "../types";

defineProps({
    tournaments: {
        type: Array as PropType<ITournamentWithEvent[]>,
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
const Tournament = useContract("Tournament", signer);

const createEvent = async (formData: ITournamentEvent) => {   
    const trx = await Tournament?.functions.addEvent( formData.tournamentId.toNumber(), formData.startDate.getTime(), formData.endDate.getTime());
    alert(`Tournament event has been created`);
}
</script>

<template>
    <form className="form" @submit.prevent="createEvent(form)">
        <h2 class="mt-5 text-xl font-bold text-primary-400">Create Event for this tournament</h2>
        <div className="form-group mt-5">
            <label htmlFor="name">Tournament</label>
            <select v-model="form.tournamentId" class="mt-2 form-control">
                <option  v-for="tournament in tournaments" :value="tournament.id">
                    {{ tournament.name }}
                </option>
            </select>
        </div>
        <div className="form-group relative">
            <label htmlFor="name">Name</label>
            <AtDateSelect v-model="form.startDate" @click.prevent class="w-24 mt-2 text-left" />
        </div>
        <div className="form-group relative">
            <label htmlFor="description">Description</label>
            <AtDateSelect v-model="form.endDate" @click.prevent class="w-24 mt-2 text-left"/>
        </div>

        <div class="text-right">
        <AtButton class="bg-primary-500 hover:bg-primary-600">
            Create
        </AtButton>
        </div>
    </form>
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
