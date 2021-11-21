<script lang="ts" setup>
import { computed } from 'vue';
import { getChainName } from '../../utils';

const props = defineProps({
    chain: {
        type: String,
        required: true,
    },
    validChain: {
        type: String,
        required: true,
    },
});

const chainName = computed(() => {
    return getChainName(formattedChain.value);
});

const formattedChain = computed(() => {
    return parseInt(props.chain, 16);
});


const bgColor = computed(() => {
    return formattedChain.value === Number(props.validChain) ? 'text-green-300 bg-green-500' : 'text-red-300 bg-red-500';
});
</script>

<template>
<div class="flex items-center px-5 font-bold bg-opacity-25 rounded-md cursor-pointer" :class="bgColor">
    Network {{ chainName }}
</div>
</template>