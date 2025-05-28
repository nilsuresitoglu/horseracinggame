<template>
  <div class="race-track">
    <div class="track-container">
      <div class="finish-line"></div>
      <div
        v-for="horse in currentRaceParticipants"
        :key="horse.id"
        class="horse-container"
      >
        <div
          class="horse"
          :class="{ 'horse-jumping': isJumping }"
          :style="{
            backgroundColor: horse.color,
            left: `${horse.progress}%`,
            transition: 'left 0.1s linear',
          }"
        >
          <span class="horse-emoji">🐎</span>
          <div class="dust-effect" v-if="horse.progress > 0"></div>
        </div>
        <div class="horse-info">
          <span class="horse-name">{{ horse.name }}</span>
          <span class="horse-stats"
            >(ID: {{ horse.id }} | Condition: {{ horse.condition }})</span
          >
        </div>
      </div>
    </div>
    <div class="race-info">
      <template v-if="currentRaceIndex < 6">
        <h3>Race {{ displayRaceNumber }} of 6 - {{ currentRaceDistance }}m</h3>
        <div class="countdown" v-if="showCountdown">{{ countdown }}</div>
      </template>
      <template v-else>
        <h3>All races completed!</h3>
      </template>
      <div
        v-if="currentRaceIndex >= 6 && store.raceResults.length"
        class="race-results mt-4"
      >
        <h4>Race Results</h4>
        <div
          v-for="result in store.raceResults"
          :key="result.raceNumber"
          class="mb-3"
        >
          <strong
            >Race {{ result.raceNumber }} ({{ result.distance }}m):</strong
          >
          <ol>
            <li v-for="horse in result.results" :key="horse.id">
              {{ horse.name }} (ID: {{ horse.id }}) - Condition:
              {{ horse.condition }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div class="horse-list">
      <h3>All Horses</h3>
      <div class="horse-grid">
        <div
          v-for="horse in store.horses"
          :key="horse.id"
          class="horse-card"
          :style="{ borderColor: horse.color }"
        >
          <span class="horse-emoji">🐎</span>
          <div class="horse-details">
            <span class="horse-name">{{ horse.name }}</span>
            <span class="horse-stats">ID: {{ horse.id }}</span>
            <span class="horse-stats">Condition: {{ horse.condition }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRaceStore } from "../stores/raceStore";
import { storeToRefs } from "pinia";

const store = useRaceStore();
const { currentRaceIndex, raceSchedule } = storeToRefs(store);

const currentRaceParticipants = ref([]);
const currentRaceDistance = ref(0);
const isJumping = ref(false);
const showCountdown = ref(false);
const countdown = ref(3);
const raceInterval = ref(null);
const isRaceComplete = ref(false);

const displayRaceNumber = computed(() => {
  return Math.min(currentRaceIndex.value + 1, 6);
});

const updateRaceProgress = () => {
  console.log("updateRaceProgress", currentRaceIndex.value, raceSchedule.value);
  if (
    !raceSchedule.value[currentRaceIndex.value] ||
    !raceSchedule.value[currentRaceIndex.value].participants
  ) {
    return;
  }

  if (raceInterval.value) {
    clearInterval(raceInterval.value);
  }

  isRaceComplete.value = false;
  currentRaceDistance.value =
    raceSchedule.value[currentRaceIndex.value].distance;
  currentRaceParticipants.value = raceSchedule.value[
    currentRaceIndex.value
  ].participants.map((horse) => ({
    ...horse,
    progress: 0,
  }));

  if (store.isRacing) {
    showCountdown.value = true;
    countdown.value = 3;

    const countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(countdownInterval);
        showCountdown.value = false;
        startRace();
      }
    }, 1000);
  }
};

const startRace = () => {
  raceInterval.value = setInterval(() => {
    currentRaceParticipants.value = currentRaceParticipants.value.map(
      (horse) => {
        const currentProgress = horse.progress;
        const speed = horse.baseSpeed + Math.random();
        const newProgress = Math.min(currentProgress + speed, 100);

        if (newProgress > currentProgress) {
          if (Math.random() > 0.7) {
            isJumping.value = true;
            setTimeout(() => (isJumping.value = false), 300);
          }

          return {
            ...horse,
            progress: newProgress,
          };
        }

        return horse;
      }
    );

    const allFinished = currentRaceParticipants.value.every(
      (horse) => horse.progress >= 100
    );
    if (allFinished && !isRaceComplete.value) {
      isRaceComplete.value = true;
      if (raceInterval.value) {
        clearInterval(raceInterval.value);
        raceInterval.value = null;
      }
      store.raceResults.push({
        raceNumber: store.currentRaceIndex + 1,
        distance: store.raceSchedule[store.currentRaceIndex].distance,
        results: [...currentRaceParticipants.value].sort(
          (a, b) => b.progress - a.progress
        ),
      });
      setTimeout(() => {
        if (store.currentRaceIndex < 5) {
          store.currentRaceIndex += 1;
        } else {
          store.isRacing = false;
        }
      }, 2000);
    }
  }, 50);
};

watch([currentRaceIndex, raceSchedule, () => store.isRacing], () => {
  updateRaceProgress();
});

onMounted(() => {
  updateRaceProgress();
});

onUnmounted(() => {
  if (raceInterval.value) {
    clearInterval(raceInterval.value);
  }
});
</script>

<style scoped>
.race-track {
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.track-container {
  position: relative;
  height: 300px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  background-image: linear-gradient(90deg, #e9ecef 50%, transparent 50%),
    linear-gradient(90deg, #e9ecef 50%, transparent 50%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: repeating-linear-gradient(
    45deg,
    #000,
    #000 10px,
    #fff 10px,
    #fff 20px
  );
  z-index: 2;
}

.horse-container {
  position: relative;
  height: 40px;
  margin: 5px 0;
}

.horse {
  position: absolute;
  font-size: 24px;
  transform: translateX(-50%);
  transition: all 0.3s ease;
}

.horse-jumping {
  animation: jump 0.3s ease;
}

.horse-emoji {
  display: inline-block;
  transition: transform 0.3s ease;
}

.dust-effect {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
  animation: dust 0.5s infinite;
}

.horse-info {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #495057;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8px;
}

.horse-name {
  font-weight: bold;
  color: #212529;
}

.horse-stats {
  color: #6c757d;
  font-size: 12px;
}

.race-info {
  text-align: center;
  margin-top: 1rem;
}

.countdown {
  font-size: 48px;
  font-weight: bold;
  color: #dc3545;
  animation: pulse 1s infinite;
}

.horse-list {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.horse-list h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #212529;
}

.horse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.horse-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid;
  transition: transform 0.2s ease;
}

.horse-card:hover {
  transform: translateY(-2px);
}

.horse-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@keyframes jump {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes dust {
  0% {
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
