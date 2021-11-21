<script lang="ts" setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
    account: {
        type: String,
        required: true,
    },
})

const maskedWallet = computed(() => {
    const first = props.account.slice(0, 4); 
    const last = props.account.slice(-4);
    return `${first}***${last}`;
});
</script>

<template>
<div class="flex items-center justify-center px-5 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-25">
    <slot>
        <i class="mr-2 fas fa-wallet"></i>
    </slot>
    {{ maskedWallet }}
</div>
</template>