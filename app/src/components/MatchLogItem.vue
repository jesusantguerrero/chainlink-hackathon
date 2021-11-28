<script lang="ts" setup>
import { computed } from "vue";

defineProps({
    vars: {
        type: Array,
        required: true
    },
    template: {
        type: String,
        required: true
    },
})

 const displayMessage = computed() {
            const regex = /\$\{(.*?)\}/ig;
            const [actionStatus] = this.template.split(":");
            const message = this.message || this.templates[this.template] || this.templates[`${actionStatus}:default`] || "";
            return message.replace(regex, (match, varName) => {
                return `<span class="${varName} template-var">${this.variables[varName] || varName }</span>`;
            })
        },
</script>

<template>
<p>
    <span class="font-bold capitalize">{{ matchEvent.attackerToken.name }}</span> caused {{ matchEvent.logs.attackerDamage }} damage to {{ matchEvent.defenseToken.name }}
</p>
</template>