<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { formatMaskedWallet } from '../../utils';

const props = defineProps({
    account: {
        type: String,
        required: true,
    },
})

const maskedWallet = computed(() => {
    return formatMaskedWallet(props.account)
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