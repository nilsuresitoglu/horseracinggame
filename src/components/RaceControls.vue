<template>
  <div class="race-controls">
    <div class="controls-container">
      <button
        class="btn btn-primary me-2"
        @click="generate"
        :disabled="isGenerating || isRacing"
      >
        <span
          v-if="isGenerating"
          class="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>
        {{ isGenerating ? "Generating..." : "Generate Races" }}
      </button>
      <button
        class="btn btn-success"
        @click="start"
        :disabled="isRacing || !hasRaces"
      >
        <span
          v-if="isRacing"
          class="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>
        {{ isRacing ? "Racing..." : "Start Races" }}
      </button>
      <button v-if="hasResults" class="btn btn-danger ms-2" @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRaceStore } from "../stores/raceStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const store = useRaceStore();
const { isRacing, isGenerating, currentRaceIndex, raceSchedule, raceResults } =
  storeToRefs(store);

const hasRaces = computed(() => raceSchedule.value.length > 0);
const hasResults = computed(() => raceResults.value.length > 0);

const generate = () => {
  store.generateHorses();
};

const start = () => {
  store.startRaces();
};

const reset = () => {
  store.resetRaces();
};
</script>

<style scoped>
.race-controls {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.controls-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.race-progress {
  max-width: 400px;
  margin: 0 auto;
}

.progress {
  height: 0.5rem;
  margin-bottom: 0.25rem;
}

.btn {
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  cursor: not-allowed;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
}
</style>
