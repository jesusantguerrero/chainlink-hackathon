<script lang="ts" setup>
import { AtButton } from "atmosphere-ui";
import { useAppState } from "../composables/useAppState";
import ClaimableList from "../components/ClaimableList.vue";
import MintForm from "../components/MintForm.vue";
import LandingHeader from "../layouts/LandingHeader.vue";
const { state } = useAppState();
</script>

<template>
<div :style="{background: 'url(/landing-background.jpg)', backgroundSize: 'cover', backgroundPositionY: 'center'}">
    <div class="flex justify-center w-full h-10 font-bold text-white bg-purple-400">
        <div class="flex items-center w-full max-w-7xl">
            The chainlink hackathon
        </div>
    </div>
    <LandingHeader @connect="$emit('connect')" class="bg-black bg-opacity-60 blur-3xl"/>
    <div class="justify-center py-20 text-center text-white bg-black bg-opacity-60">
        <div>
            <h1 class="text-2xl font-bold">Train your Roosters and fight</h1>
            <p class="font-bold"> Build your legacy as a rooster trainer and scale up the tops</p>
        </div>
        <div class="py-12 text-center">
            <AtButton class="font-bold text-white bg-purple-400" v-if="!state.user" @click="$emit('connect')"> Connect </AtButton>
        <MintForm v-else />
        </div>
    </div>
</div>
<div class="py-20 text-white bg-gray-900">
    <div class="relative flex justify-center max-w-6xl px-5 py-5 mx-auto bg-gray-800 rounded-lg">
        <div class="absolute text-3xl font-bold -top-6">
            Breeds
        </div>
        Black Colorao Pinto White
    </div>
</div>
<div class="py-20 text-white bg-gray-900">
    <div class="relative flex justify-center max-w-6xl px-5 py-5 mx-auto bg-gray-800 rounded-lg">
        <div class="absolute text-3xl font-bold -top-6">
            Tournaments
        </div>
        Black Colorao Pinto White
    </div>
</div>
<div class="py-20 text-white bg-gray-900">
    <div class="relative flex flex-col items-center justify-center max-w-6xl px-5 py-5 mx-auto bg-gray-800 rounded-lg">
        <div class="absolute text-3xl font-bold -top-6">
            Whitepaper
        </div>
        <p>
            Every rooster have a set of attributes that determine their success in a fight.
        </p>
        <p class="mt-5">
            Strength:
        </p>
        <p class="mt-5">
            Speed:
        </p>
        <p class="mt-5">
            Agility:
        </p>
    </div>
</div>
<div class="py-20 text-white bg-gray-900" id="claim">
    <div class="relative flex justify-center max-w-6xl px-5 py-5 mx-auto bg-gray-800 rounded-lg">
        <div class="absolute text-3xl font-bold -top-6">
            Free Roosters to Claim
        </div>
        <ClaimableList class="w-full px-5" />
    </div>
</div>
</template>