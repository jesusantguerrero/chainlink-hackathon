<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import { AtButton } from "atmosphere-ui";
import { fetchMyItems, NFTAsset } from "../utils/fetchMyItems";


const items = ref<NFTAsset[]>([]);
onMounted(async () => {
    items.value = await fetchMyItems();
})
</script>

<template>
    <div class="claimable-list">
        <div class="flex flex-wrap gap-2 mt-5 claimable-list__items" v-if="items.length">
            <div v-for="item in items" class="overflow-hidden border rounded-md claimable-list__item">
                <div class="overflow-hidden rounded-t-md claimable-list__item__image">
                    <img :src="item.image" class="w-64"/>
                    <div class="px-4 pb-3 bg-gray-700">
                        <h3 class="text-xl">{{item.name}}</h3>
                        <p class="text-sm text-gray-300">{{item.description}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center mt-5 space-x-2" v-else>
            <AtButton class="bg-purple-500"> Claim your free Rooster</AtButton> 
            <span>Or </span>
            <AtButton class="bg-purple-500">Buy one</AtButton>
        </div>
    </div>
</template>
