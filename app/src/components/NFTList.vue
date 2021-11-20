<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import { AtButton } from "atmosphere-ui";
import { fetchMyItems, NFTAsset } from "../utils/fetchMyItems";
import RoosterCard from "./RoosterCard.vue";
import { INftDetails } from "../types";


const roosters = ref<INftDetails[]>([]);
const isLoading = ref(true);
onMounted(async () => {
    roosters.value = await fetchMyItems();
    isLoading.value = false;
})
</script>

<template>
    <div class="text-center transition claimable-list">
        <div class="mt-10 text-4xl text-white" v-if="isLoading">
            <i class=" fa fa-circle-notch fa-spin fa-3x fa-fw" />
        </div>
        <div class="flex flex-wrap gap-2 mt-5 claimable-list__items" v-else-if="roosters.length">
            <div v-for="rooster in roosters" class="overflow-hidden rounded-md claimable-list__item">
                <RoosterCard :rooster="rooster" />                    
            </div>
        </div>
        <div class="flex items-center mt-5 space-x-2" v-else>
            <AtButton class="bg-purple-500"> Claim your free Rooster</AtButton> 
            <span>Or </span>
            <AtButton class="bg-purple-500">Buy one</AtButton>
        </div>
    </div>
</template>
