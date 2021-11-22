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
    name: 'Dashboard',
    to: '/dashboard',
}];

const actions = [{
    name: 'Learn more',
    url: '/login',
    class: 'text-purple-300'
}, {
    name: 'Connect',
    emit: true,
    class: "relative px-5 py-2 overflow-hidden rounded-md focus:outline-none hover:bg-opacity-80 px-10 font-bold text-white bg-purple-400"
}]
</script>

<template>
<div class="bg-transparent">
    <AtSiteHeader 
        title="" 
        :links="links" 
        :actions="actions" 
        dot-class="text-transparent" 
        @action="$emit('connect')" 
    >
        <template #actions v-if="state.user">
            <div class="text-white">
            {{ state.user?.getUsername() }}
            </div>
        </template>
    </AtSiteHeader>
</div>
</template>