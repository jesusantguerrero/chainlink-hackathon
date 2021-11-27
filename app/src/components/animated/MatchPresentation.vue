<template>
<div class="absolute top-0 w-3/4 h-screen bg-black bg-opacity-50 border-l-4 border-r-4 entrance-banner animate__animated animate__backInLeft"
>
    <div class="w-full h-full bg-black opacity-25 filter blur-md">
    
    </div>
</div>
<div ref="logo" class="absolute top-0 flex items-center justify-center w-3/4 h-screen animate__animated animate__backInLeft">
<div class="text-center">
    <img src="../../assets/logo.svg">
    <h2 class="text-4xl font-bold text-white">The rooster game</h2>
</div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const logo = ref<HTMLElement>();
onMounted(() => {
    setTimeout(() => {
        document.querySelector('.entrance-banner').classList.add('animate__fadeOut');
        logo.value.classList.add('animate__fadeOut');
    }, 3000);
})
</script>


<style>
.animate__fadeOut {
    position: absolute;
    display: none;
    z-index: -1;
}
</style>