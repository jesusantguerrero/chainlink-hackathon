<script setup lang="ts">
import RoosterCard from "./RoosterCard.vue";
import { AppState } from "../composables/AppState";
import PageLoader from "./animated/PageLoader.vue";
import { AtButton } from "atmosphere-ui";
import { onMounted } from "@vue/runtime-core";

onMounted(async() => {
  if (AppState.rooster && AppState.rooster.length === 0) {
    await AppState.fetchMyNfts();
  }
});
</script>

<template>
    <div class="text-center transition claimable-list">
        <div class="mt-10 text-4xl text-white" v-if="AppState.isLoading">
            <PageLoader />
        </div>
        <div class="flex flex-col flex-wrap w-full gap-2 mt-5 claimable-list__items" v-else-if="AppState.roosters.length">
            <div v-for="rooster in AppState.roosters" class="overflow-hidden rounded-md claimable-list__item">
                <RoosterCard :rooster="rooster" :is-owner="true" />                    
            </div>
        </div>
        <div class="flex items-center mt-5 space-x-2" v-else>
            <RouterLink 
                to="/marketplace"
                class="px-2 py-2 rounded-md bg-primary hover:bg-primary-600"> 
                Claim your free Rooster
            </RouterLink> 
            <AtButton @click="AppState.fetchMyNfts()" type="secondary" :disabled="AppState.isLoading">
                Refresh List
            </AtButton>
        </div>
    </div>
</template>
