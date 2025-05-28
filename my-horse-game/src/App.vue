<template>
  <div class="container">
    <h1 class="my-4">🏇 Horse Racing Game</h1>
    <RaceControls />
    <RaceTrack v-if="isRacing" />
    <Results />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRaceStore } from "./stores/raceStore";
import RaceControls from "./components/RaceControls.vue";
import RaceTrack from "./components/RaceTrack.vue";
import Results from "./components/Results.vue";

const store = useRaceStore();
const { isRacing } = storeToRefs(store);
</script>
