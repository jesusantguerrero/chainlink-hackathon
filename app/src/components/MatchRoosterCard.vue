<script lang="ts" setup>
import { PropType } from 'vue';
import { INftDetails } from '../types';

defineProps({
    rooster: {
        type: Object as PropType<INftDetails>,
        required: true
    },
    isAttacker: {
        type: Boolean as PropType<boolean>,
    }
})
</script>

<template>
<div class="flex flex-col items-center justify-center w-full text-center">
    <img :src="rooster.image" class="h-52" :class="{attacker: isAttacker}">
    <p class="text-xl font-bold capitalize">{{ rooster.name }}</p>
</div>
</template>