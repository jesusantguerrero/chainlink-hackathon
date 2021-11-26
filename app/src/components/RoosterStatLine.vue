<script lang="ts" setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    baseValue: {
        type: Number,
        default: 0,
    },
    modelValue: {
        type: Number,
        default: 0,
    },
    availablePoints: {
        type: Number,
        default: 0,
    },
    isEditable: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue']);

const decrement  = () => {
    if (props.modelValue > 0) {
        emit('update:modelValue', props.modelValue-1)
    }
}

const increment  = () => {
    if (props.availablePoints != -1 && !props.availablePoints) return
    emit('update:modelValue', props.modelValue+1)
}
</script>

<template>
<div class="flex justify-between w-60">
 <div class="capitalize">{{ name }}: {{ Number(baseValue) + Number(modelValue) }} 
 <span v-if="modelValue">(+{{modelValue}})</span></div> 
 <div class="flex ml-2 space-x-1" v-if="isEditable">
    <button 
            @click="decrement()" 
            :disabled="modelValue == 0"
            class="px-2 transition border-2 rounded-md bg-primary-400 border-roti "
            :class="[ modelValue == 0 ? 'opacity-70' : 'hover:bg-primary-700']"
        >
            <i class="fa fa-chevron-left"></i> 
        </button>
    <button 
        :disabled="!availablePoints" 
        @click="increment()" 
        class="px-2 transition border-2 rounded-md bg-primary-400 border-roti "
        :class="[!availablePoints ? 'opacity-75': 'hover:bg-primary-700']"
    > 
        <i class="fa fa-chevron-right"></i>
    </button>
 </div>
</div>
</template>