<script setup lang="ts">
import { AtButton } from "atmosphere-ui";
import { ethers } from "ethers";
import { getContracts } from "../composables/getContracts";
import { getProvider } from "../composables/getProvider";
import { ref } from "vue";
import { AppState } from "../composables/AppState";

const mintToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const { Cockfighter } = getContracts(signer);

    Cockfighter?.functions.mint(await signer.getAddress(), "https://localhost:3000/image.jpg");
}

</script>

<template>
    <div class="claimable-list">
        <AtButton  class="font-bold text-white bg-roti-500" @click="mintToken()"> 
            Claim free Rooster 
        </AtButton>
    </div>
</template>
