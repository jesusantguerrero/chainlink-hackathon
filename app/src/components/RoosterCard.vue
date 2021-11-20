<script setup lang="ts">
import { PropType, ref } from '@vue/runtime-core';
import { ethers } from 'ethers';
import { useContract } from '../composables/useContract';
import { INftDetails } from '../types';
import { AtButton } from "atmosphere-ui";
import { useMessage } from '../utils/useMessage';

const props = defineProps({
    rooster: {
        type: Object as PropType<INftDetails>,
        required: true,
    }
})

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const RoosterFight = useContract("RoosterFight", signer);

const isEditing = ref(false);
const { setMessage } = useMessage();
const setName = async (name: string) => {
    await RoosterFight?.setName(props.rooster.tokenId, name)
    isEditing.value = false;
    setMessage("Name updated");
}
</script>

<template>
<div class="flex">
    <div class="mr-20">
        <div class="mb-5">
            <div>Health: {{ rooster?.hp}}</div>
            <div>XP: <span class="font-bold">{{ rooster.experience }}</span> (Level: {{ rooster?.level }})</div>
            
        </div>
        
        <div>
            <div>Strength: {{ rooster?.strength}}</div>
            <div>Strength: {{ rooster?.speed }} </div>
            <div>Agility: {{ rooster?.agility }} </div>
        </div>
    </div>
    <div>
        <img :src="rooster.image" class="w-64"/>
        <div class="px-4 pb-3 bg-gray-700">
            <input class="text-xl capitalize bg-transparent" :disabled="!isEditing" v-model="rooster.name" />
            <AtButton class="bg-purple-500" @click="isEditing=true" v-if="!isEditing">
                <i class="fa fa-edit"></i>
            </AtButton>
            <div v-else class="inline-flex space-x-2">
                <AtButton class="bg-gray-500" @click="setName(rooster.name)">
                    <i class="fa fa-times"></i>
                </AtButton>
                <AtButton class="bg-purple-500" @click="setName(rooster.name)">
                    <i class="fa fa-save"></i>
                </AtButton>
            </div>
        </div>
    </div>
</div>
</template>