<script lang="ts" setup>
import { AtButton, AtSiteFooter } from "atmosphere-ui";
import { useAppState } from "../composables/useAppState";
import ClaimableList from "../components/ClaimableList.vue";
import MintForm from "../components/MintForm.vue";
import LandingHeader from "../layouts/LandingHeader.vue";
import LandingSection from "../layouts/LandingSection.vue";
const { state } = useAppState();

const breeds = ["black", "colorao", "pinto", "white"]; 
</script>

<template>
<div :style="{background: 'url(/cockfight-bg.jpg)', backgroundSize: 'cover', backgroundPositionY: 'center'}">
    <LandingHeader @connect="$emit('connect')" class="bg-black bg-opacity-80"/>
    <div class="justify-center pt-32 pb-12 text-center text-white bg-black bg-opacity-80">
        <div class="flex items-center mx-auto max-w-7xl">
            <div class="text-left">
                <div>
                    <h1 class="text-5xl font-bold">Train your Roosters and fight</h1>
                    <p class="font-bold"> Build your legacy as a rooster trainer and scale up the tops</p>
                </div>
                <div class="py-12 space-x-2 text-left">
                    <AtButton class="font-bold border-2 text-primary border-primary" v-if="!state.user" @click="$emit('connect')"> Connect </AtButton>
                    <RouterLink to="/marketplace" class="px-5 py-2 font-bold text-white border-2 rounded-md border-primary bg-primary" v-if="!state.user"> Claim a free rooster </RouterLink>
                    <MintForm v-else />
                </div>
            </div>
            <div class="flex justify-end w-full h-full text-right">
                <img alt="" class="w-96" src="/images/breed_colorao.png">
            </div>
        </div>
        <div class="relative h-24 max-w-5xl mx-auto mt-10 overflow-hidden bg-white border border-gray-500 rounded-md bg-opacity-10">
            <div class="absolute w-full h-full bg-white bg-opacity-20 filter blur-3xl">
            </div>
            <h4> Powered by</h4>
            <div class="flex justify-around mt-4 text-2xl font-bold divide-x-2">
                <div class="w-full text-center">
                    Chainlink
                </div>
                <div class="w-full text-center">
                    Moralis
                </div>
                <div class="w-full">
                    Polygon
                </div>
            </div>
        </div>
    </div>
</div>
<LandingSection title="Breeds" >
        <template #description>
            The breed is determined by the color of the chest of the Rooster the other combinations are stylistic
            but the breed add attributes on mint that make Roosters stronger. but with training and fighting  you can update the natural abilities of your Rooster
        </template>
        
        <div class="flex">
            <div class="text-center" v-for="breed in breeds">
                <img :src="`/images/breed_${breed}.png`" />
                <span class="text-xl font-bold text-center capitalize">{{ breed }}</span>
            </div>
        </div>
</LandingSection>
<LandingSection class="bg-blue-500" title="Tournaments" inner-class="bg-blue-700">
         <template #description>
            Tournaments are periodic events where the Roosters can join by paying a determined fee
            with a duration of a week were you can fight once with every other Rooster in the tournament if you win you got 3 points at the end the rooster with more points get the prize.
         </template>
        
        <div>
            <img src="/images/tournaments.png" alt="tournaments" class="rounded-lg">
            <div class="flex justify-center w-full">
                <RouterLink to="/tournaments" class="inline-block px-5 py-1 mt-5 font-bold text-blue-500 transition transform bg-white border-2 rounded-md hover:scale-105 hover:bg-blue-500 hover:text-white">
                    Go to Tournaments
                </RouterLink>
            </div>
        </div>
</LandingSection>
<LandingSection title="Fighting System">
        <template #description>
            Every rooster have a set of attributes that determine their success in a fight.

            In a fight both Roosters have an opportunity to throw a punch and the damage will be between min-damage (strength) and max-damage (strength + speed).
            The rooster that cause more damage is the winner.
        </template>
        <div>
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
</LandingSection>
<LandingSection class="bg-primary-500" title="Train and Upgrade" inner-class="bg-primary-700">
         <template #description>
            After each fight a rooster will gain attribute points that you can assign to whatever attribute you like.
         </template>
        
        <img src="/images/upgrade.png" alt="upgrade" class="rounded-lg">
</LandingSection>
<div class="py-20 text-white bg-gray-900" id="claim">
    <div class="relative flex justify-center max-w-6xl px-5 py-5 mx-auto bg-gray-800 rounded-lg">
        <div class="absolute text-3xl font-bold -top-6">
            Free Roosters to Claim
        </div>
        <ClaimableList class="w-full px-5" :limit="8" />
    </div>
</div>
<div :style="{background: 'url(/landing-background.jpg)', backgroundSize: 'cover', backgroundPositionY: 'center'}">
    <div class="justify-center py-10 text-center text-white bg-black bg-opacity-80">
        <div class="flex items-center justify-between mx-auto max-w-7xl">
            <div class="text-left">
                <div>
                    <h1 class="text-2xl font-bold">Claim your free rooster </h1>
                    <p class="font-bold"> And start fighting</p>
                </div>
            </div>
            <div class="py-12 space-x-2 text-left">
                <RouterLink to="/marketplace" class="px-3 py-2 font-bold text-white border-2 rounded-md border-primary bg-primary"> Claim a free rooster </RouterLink>
            </div>
        </div>
    </div>
</div>
<div class="bg-gray-900">
    <AtSiteFooter title="RoosterFight" year="2021" subtitle="RoosterFight - The rooster game" />
</div>
</template>