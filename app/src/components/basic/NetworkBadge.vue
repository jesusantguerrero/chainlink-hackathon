<script lang="ts" setup>
import { computed } from 'vue';

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

const networks: Record<number, string> = {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    42: 'Kovan',
    137: 'Polygon',
    80001: 'Mumbai',
    1337: 'Localhost',
    5777: 'Ganache',
}
const formattedChain = computed(() => {
    return parseInt(props.chain, 16);
});

const chainName = computed(() => {
    return networks[formattedChain.value];
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