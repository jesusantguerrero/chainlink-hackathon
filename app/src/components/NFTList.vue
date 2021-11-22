<script setup lang="ts">
import { AtButton } from "atmosphere-ui";
import RoosterCard from "./RoosterCard.vue";
import { AppState } from "../composables/AppState";

</script>

<template>
    <div class="text-center transition claimable-list">
        <div class="mt-10 text-4xl text-white" v-if="AppState.isLoading">
            <i class=" fa fa-circle-notch fa-spin fa-3x fa-fw" />
        </div>
        <div class="flex flex-col flex-wrap w-full gap-2 mt-5 claimable-list__items" v-else-if="AppState.roosters.length">
            <div v-for="rooster in AppState.roosters" class="overflow-hidden rounded-md claimable-list__item">
                <RoosterCard :rooster="rooster" :is-owner="true" />                    
            </div>
        </div>
        <div class="flex items-center mt-5 space-x-2" v-else>
            <AtButton class="bg-purple-500"> Claim your free Rooster</AtButton> 
            <span>Or </span>
            <AtButton class="bg-purple-500">Buy one</AtButton>
        </div>
    </div>
</template>
