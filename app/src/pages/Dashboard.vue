<script setup lang="ts">

const dashboardMenu = [
    "General",
    "Ring",
    "Sponsors",
    "Notifications"
]
</script>

<template>
    <div class="flex justify-between px-5 py-3 text-white bg-gray-700">
        <div>
            <h1 class="text-2xl font-bold text-purple-400">Home</h1>
        </div>
        <div class="flex space-x-2">
            <div>Tokens</div>
            <div>Money</div>
            <div>Energy</div>
            <div>Hospital Points</div>
        </div>
    </div>

    <div class="mx-auto mt-10 text-white max-w-7xl">
        <ul class="flex justify-around text-white bg-gray-700">
            <li v-for="item in dashboardMenu" class="w-full py-3 text-center cursor-pointer hover:bg-gray-800">{{
                item
            }}</li>
        </ul>

        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h1>My Trainings</h1>
        </div>
        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h1>My Roosters</h1>
        </div>
        <div class="px-5 py-3 mt-2 bg-gray-700 current-training">
            <h1> Title of the section</h1>
            <div class="flex gap-5 mt-5">
                <div class="w-4/12 space-y-2">
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                        // Tournament Info
                    </div>
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                        // Sponsor
                    </div>
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                        // Notifications
                    </div>
                </div>
                <div class="w-8/12">
                    <div class="px-5 py-3 bg-gray-800 rounded-md">
                    
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>