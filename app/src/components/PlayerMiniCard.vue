<script setup lang="ts">
defineProps({
    player: {
        type: Object,
        required: true
    },
    marked:{
        type: Boolean,
        default: false
    }
})
</script>

<template>
<div v-if="player" class="flex items-center space-x-2">
    <img :src="player.image" class="rounded-full w-9 h-9">
    <span class="capitalize" :class="{'text-roti font-bold': marked}">
        {{ player.name }}
    </span>
</div>
</template>