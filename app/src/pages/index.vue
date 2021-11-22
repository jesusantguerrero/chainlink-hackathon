<script lang="ts" setup>
import { AtButton } from "atmosphere-ui";
import { useAppState } from "../composables/useAppState";
import ClaimableList from "../components/ClaimableList.vue";
import MintForm from "../components/MintForm.vue";
import LandingHeader from "../layouts/LandingHeader.vue";
import LandingSection from "../layouts/LandingSection.vue";
const { state } = useAppState();

const breeds = ["black", "colorao", "pinto", "white"]; 
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
<LandingSection class="bg-purple-500" title="Tournaments" inner-class="bg-purple-700">
         <template #description>
            Tournaments are periodic events where the Roosters can join by paying a determined fee
            with a duration of a week were you can fight once with every other Rooster in the tournament if you win you got 3 points at the end the rooster with more points get the prize.
         </template>
        
        <img src="/images/tournaments.png" alt="tournaments" class="rounded-lg">
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
<LandingSection class="bg-roti-500" title="Train and Upgrade" inner-class="bg-roti-700">
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
        <ClaimableList class="w-full px-5" />
    </div>
</div>
</template>