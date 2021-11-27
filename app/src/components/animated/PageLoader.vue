<template>
<div class="text-center opacity-70">
    <img src="../../assets/logo.svg" class="mx-auto w-36 h-36 animate-pulse opacity-70" />
    <div class="h-2 mx-auto overflow-hidden bg-opacity-50 border rounded-md border-primary w-52 bg-primary-300">
        <div class="h-full rounded-md bg-primary indeterminate"></div>
    </div>
</div>
</template>

<style lang="postcss" scoped>
.indeterminate {
  transition: width 0.3s;
  width: 50%;
  animation: indeterminate 1s linear infinite;
}
@keyframes indeterminate {
  0% {
    width: 0%;
    transform: translateX(0, -50%);
  }
  100% {
    width: 100%;
    transform: translateX(100%);
  }
}
</style>