<script lang="ts" setup>
import { AtSiteHeader } from "atmosphere-ui";
import { useAppState } from "../composables/useAppState";
const { state } = useAppState();

const links = [{
    name: 'Home',
    to: '/',
}, {
    name: 'Claim',
    url: '/#claim'
}, {
    name: 'Marketplace',
    to: '/marketplace',
}, {
    name: 'Dashboard',
    to: '/dashboard',
}];

const actions = [{
    name: 'Learn more',
    url: '/login',
    class: 'text-roti'
}, {
    name: 'Connect',
    emit: true,
    class: "relative px-5 py-2 overflow-hidden rounded-md focus:outline-none hover:bg-opacity-80 px-10 font-bold text-white bg-roti"
}]
</script>

<template>
<div class="bg-purple-900 border-b border-white">
    <AtSiteHeader 
        title="RoosterFight" 
        :links="links" 
        :actions="actions" 
        dot-class="text-yellow-500" 
        @action="$emit('connect')" 
    >
        <template #actions v-if="state.user">
            <div>
            {{ state.user?.getUsername() }}
            </div>
        </template>
    </AtSiteHeader>
</div>
</template>