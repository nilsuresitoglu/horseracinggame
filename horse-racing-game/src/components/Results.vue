<template>
  <div class="results-container">
    <h2 class="mb-4">Race Results</h2>
    <div v-if="raceResults.length === 0" class="no-results">
      No races completed yet
    </div>
    <div v-else class="results-list">
      <div
        v-for="(result, index) in raceResults"
        :key="index"
        class="race-result mb-4"
      >
        <h3>Race {{ result.raceNumber }} - {{ result.distance }}m</h3>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Position</th>
                <th>Horse Name</th>
                <th>ID</th>
                <th>Color</th>
                <th>Condition</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(horse, horseIndex) in result.results" :key="horse.id">
                <td>{{ horseIndex + 1 }}</td>
                <td class="horse-name">{{ horse.name }}</td>
                <td>{{ horse.id }}</td>
                <td>
                  <span
                    class="color-dot"
                    :style="{ backgroundColor: horse.color }"
                  ></span>
                  {{ horse.color }}
                </td>
                <td>{{ horse.condition }}</td>
                <td>{{ horse.performance.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRaceStore } from "../stores/raceStore";
import { storeToRefs } from "pinia";

const store = useRaceStore();
const { raceResults } = storeToRefs(store);
</script>

<style scoped>
.results-container {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-results {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.race-result {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.table {
  margin-bottom: 0;
}

.table th {
  background-color: #e9ecef;
}

.horse-name {
  font-weight: bold;
  color: #212529;
}
.table tbody tr:hover {
  background-color: #e9ecef;
  transition: background-color 0.2s ease;
}

.table td:first-child {
  font-weight: bold;
  color: #0d6efd;
}

.race-result:not(:last-child) {
  border-bottom: 2px solid #dee2e6;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>
