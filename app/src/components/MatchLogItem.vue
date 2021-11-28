<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
    vars: {
        type: Object,
        required: true
    },
    template: {
        type: String,
        required: true
    },
})

 const displayMessage = computed(() =>  {
    const regex = /\$\{(.*?)\}/ig;
    return props.template.replace(regex, (match, varName) => {
        return `<span class="${varName} capitalize text-primary font-bold template-var">${props.vars[varName] || varName }</span>`;
    })
});
</script>

<template>
<p v-html="displayMessage" />    
</template>