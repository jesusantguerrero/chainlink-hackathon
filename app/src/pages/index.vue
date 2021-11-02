<script lang="ts" setup>
import { AtSiteHeader } from "atmosphere-ui";

const links = [{
    name: 'Home',
    url: '/'
}, {
    name: 'Claim',
    url: '/#claim'
}, {
    name: 'Marketplace',
    url: '/marketplace'
}, {

}]
</script>

<template>
<div class="bg-red-900">
    <AtSiteHeader title="RoosterFight" :links="links" dot-class="text-yellow-500" />
</div>
This is america
</template>