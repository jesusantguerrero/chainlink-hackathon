<script lang="ts" setup>
import { AtButton } from "atmosphere-ui";
import { useAppState } from "../composables/useAppState";
import ClaimableList from "../components/ClaimableList.vue";
import MintForm from "../components/MintForm.vue";
import LandingHeader from "../layouts/LandingHeader.vue";
const { state } = useAppState();
</script>

<template>
<LandingHeader @connect="$emit('connect')" />
<div class="justify-center py-20 text-center text-white bg-purple-700">
    <div>
        <h1 class="text-2xl font-bold">Train your Roosters and fight</h1>
        <p class="font-bold"> Build your legacy as a rooster trainer and scale up the tops</p>
    </div>
    <div class="py-12 text-center">
        <AtButton class="font-bold text-white bg-roti-500" v-if="!state.user" @click="$emit('connect')"> Connect </AtButton>
       <MintForm v-else />
    </div>
</div>
<div class="py-20 text-white bg-gray-900" id="claim">
    <ClaimableList class="mx-auto max-w-7xl" />
</div>
</template>