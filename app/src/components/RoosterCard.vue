<script setup lang="ts">
import { onMounted, PropType, ref, reactive, computed } from '@vue/runtime-core';
import { useContract } from '../composables/useContract';
import { INftDetails } from '../types';
import { AtButton } from "atmosphere-ui";
import { useMessage } from '../utils/useMessage';
import { AppState } from '../composables/AppState';
import RoosterStatLine from './RoosterStatLine.vue';
import { fetchMyItems } from '../utils/fetchMyItems';
import { nextTick } from 'process';

const props = defineProps({
    rooster: {
        type: Object as PropType<INftDetails>,
        required: true,
    },
    isOwner: {
        type: Boolean,
        default: false,
    }
})

const RoosterFight = useContract("RoosterFight", AppState.signer);

// Naming logic 
const isEditing = ref(false);
const { setMessage } = useMessage();
const setName = async (name: string) => {
    await RoosterFight?.setName(props.rooster.tokenId, name)
    isEditing.value = false;
    setMessage("Name updated");
}

// Distributing points logic
const updateForm = reactive({
    strength: 0,
    speed: 0,
    agility: 0,
});


const availablePoints = ref(0);
const pointsToAssign = computed(() => {
    return availablePoints.value - Object.values(updateForm).reduce((sum,  num) => sum+num, 0) ;
})

const fetchAvailablePoints = async () => {
    const points = await RoosterFight?.getAvailablePoints(props.rooster.tokenId);
    availablePoints.value = points;
}

const distributingPoints = ref(false);
const distributePoints = async () => {
    const trx = await RoosterFight?.distributePoints(props.rooster.tokenId, updateForm.strength, updateForm.speed, updateForm.agility);
    await trx?.wait(1);
    nextTick(async () => {
        setMessage("Points distributed");
        distributingPoints.value = false;
        AppState.roosters = await fetchMyItems(AppState.signer);
        await fetchAvailablePoints();
        updateForm.strength = 0;
        updateForm.speed = 0;
        updateForm.agility = 0;
    })
}

onMounted(async () => {
    await fetchAvailablePoints();
})
</script>

<template>
<div class="flex">
    <div class="mr-20 space-y-5 text-left">
        <div>
            <div>Health: {{ rooster?.hp}}</div>
            <div>XP: <span class="font-bold">{{ rooster.experience }}</span> (Level: {{ rooster?.level }})</div>
        </div>
        
        <div class="space-y-2">
            <RoosterStatLine
                v-for="(_attribute, attrName) in updateForm"
                :key="attrName"
                :name="attrName"
                v-model="updateForm[attrName]" 
                :base-value="rooster[attrName]" 
                :available-points="pointsToAssign"
            />
        </div>
        
        <div v-if="isOwner">
            <div>Available Points: <span :class="{'font-bold text-roti text-2xl': availablePoints }">
                {{ pointsToAssign }}
            </span>
            <AtButton @click="distributePoints()" v-if="availablePoints != pointsToAssign" class="ml-5 bg-gray-800 border border-roti"> 
                <i class="fa fa-circle-notch fa-spin fa-3x fa-fw" v-if="distributingPoints" />
                Assign
            </AtButton>
            </div>
        </div>
    </div>
    <div>
        <img :src="rooster.image" class="w-64"/>
        <div class="flex items-center px-4 pb-3 space-x-2 bg-gray-700">
            <input class="px-3 text-xl capitalize bg-transparent" 
            :class="{'border rounded-md py-1 bg-gray-800': isEditing}"
            :disabled="!isEditing" v-model="rooster.name" />
            <AtButton class="bg-purple-500" @click="isEditing=true" v-if="!isEditing && isOwner">
                <i class="fa fa-edit"></i>
            </AtButton>
            <div v-else-if="isOwner" class="inline-flex space-x-2">
                <AtButton class="bg-gray-500" @click="isEditing=false">
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