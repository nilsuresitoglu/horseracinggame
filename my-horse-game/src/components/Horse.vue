<template>
  <div class="track">
    <div
      class="horse"
      :style="{
        backgroundColor: horse.color,
        transform: `translateX(${position}%)`,
        transition: 'transform 3s ease-out',
      }"
    >
      🐎 {{ horse.id }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  horse: Object,
  triggerMove: Boolean,
});

const position = ref(0);

watch(
  () => props.triggerMove,
  (newVal) => {
    if (newVal) {
      const baseSpeed = 100;
      const speedFactor = props.horse.condition / 100;
      position.value = Math.min(90, speedFactor * baseSpeed);
    }
  }
);
</script>

<style scoped>
.track {
  width: 100%;
  height: 60px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 5px 0;
  position: relative;
  overflow: hidden;
}

.horse {
  width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
