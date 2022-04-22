<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  innerClass: {
    type: String,
    default: "bg-gray-700",
  }
});
</script>

<template>
<div class="px-5 py-20 text-white bg-gray-900">
    <div class="relative flex flex-col items-center justify-center max-w-6xl px-5 py-5 mx-auto rounded-lg" :class="innerClass">
        <div class="absolute text-3xl font-bold -top-6">
            {{ title }}
        </div>
        <p class="max-w-2xl text-center">
            <slot name="description">
             {{ description}}
            </slot>
        </p>
        <div class="mt-10">
            <slot />
        </div>
    </div>
</div>
</template>