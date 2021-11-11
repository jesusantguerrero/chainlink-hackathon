<script lang="ts" setup>
import { AtSiteHeader, AtButton } from "atmosphere-ui";
import { useAppState } from "../composables/useAppState";
import ClaimableList from "../components/ClaimableList.vue";
import MintForm from "../components/MintForm.vue";
import { RouterLink } from "vue-router";
const { state } = useAppState();

const links = [{
    name: 'Home',
    to: '/',
    component: RouterLink
}, {
    name: 'Claim',
    url: '/#claim'
}, {
    name: 'Marketplace',
    to: '/marketplace',
    component: RouterLink
}, {
    name: 'Dashboard',
    to: '/dashboard',
    component: RouterLink
}];

const actions = [{
    name: 'Learn more',
    url: '/login',
    class: 'text-roti'
}, {
    name: 'Connect',
    url: '/signup',
    class: "relative px-5 py-2 overflow-hidden rounded-md focus:outline-none hover:bg-opacity-80 px-10 font-bold text-white bg-roti"
}]
</script>

<template>
<div class="bg-purple-900 border-b border-white">
    <AtSiteHeader title="RoosterFight" :links="links" :actions="actions" dot-class="text-yellow-500" />
</div>
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
<div class="py-20 text-white bg-gray-900">
    <ClaimableList class="mx-auto max-w-7xl" />
</div>
</template>