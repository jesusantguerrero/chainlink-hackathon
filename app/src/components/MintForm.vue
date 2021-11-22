<script setup lang="ts">
import { AtButton } from "atmosphere-ui";
import { ethers } from "ethers";
import { useContract } from "../composables/useContract";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";
import { AppState } from "../composables/AppState";

const mintToken = async () => {
    const RoosterFight  = useContract("RoosterFight", AppState.signer);
    RoosterFight?.functions.mint();
}

</script>

<template>
    <div class="claimable-list">
        <AtButton  class="font-bold text-white bg-roti-500" @click="mintToken()"> 
            Claim free Rooster 
        </AtButton>
    </div>
</template>
