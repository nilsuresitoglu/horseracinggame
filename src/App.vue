<template>
  <div id="app">
    <h1>Horse Racing Game</h1>
    <RaceControls />
    <RaceTrack />
    <Results />
  </div>
</template>

<script>
import RaceControls from "./components/RaceControls.vue";
import RaceTrack from "./components/RaceTrack.vue";
import Results from "./components/Results.vue";

export default {
  name: "App",
  components: {
    RaceControls,
    RaceTrack,
    Results,
  },
};
</script>
