import { defineStore } from "pinia";

export const useRaceStore = defineStore("race", {
  state: () => ({
    horses: [],
    raceSchedule: [],
    currentRaceIndex: 0,
    raceResults: [],
    isRacing: false,
    isGenerating: false,
  }),

  actions: {
    generateHorses() {
      this.isGenerating = true;

      const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "orange",
        "pink",
        "brown",
        "gray",
        "black",
        "cyan",
        "magenta",
        "lime",
        "teal",
        "indigo",
        "violet",
        "gold",
        "silver",
        "maroon",
        "navy",
      ];

      const horseNames = [
        "Thunder Bolt",
        "Midnight Star",
        "Silver Shadow",
        "Golden Spirit",
        "Desert Wind",
        "Ocean Wave",
        "Mountain Peak",
        "Forest Runner",
        "Sun Dancer",
        "Moon Walker",
        "Storm Chaser",
        "Rain Maker",
        "Fire Blaze",
        "Ice Crystal",
        "Diamond Dust",
        "Ruby Heart",
        "Emerald Dream",
        "Sapphire Sky",
        "Amber Light",
        "Pearl Shine",
      ];

      const shuffledNames = [...horseNames].sort(() => 0.5 - Math.random());

      this.horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: shuffledNames[i],
        color: colors[i],
        condition: Math.floor(Math.random() * 100) + 1,
      }));

      this.generateRaceSchedule();
      this.isGenerating = false;
    },

    generateRaceSchedule() {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200];

      // Tüm atları önceden karıştır
      const shuffledHorses = [...this.horses].sort(() => 0.5 - Math.random());

      this.raceSchedule = distances.map((distance, index) => {
        // Her yarış için 10 at seç
        const startIndex = (index * 10) % 20;
        const participants = shuffledHorses.slice(startIndex, startIndex + 10);

        return {
          raceNumber: index + 1,
          distance: distance,
          participants: participants.map((horse) => ({
            ...horse,
            baseSpeed: horse.condition / 10, // Temel hızı önceden hesapla
          })),
          status: "pending",
        };
      });
    },

    startRaces() {
      if (this.isRacing || this.raceSchedule.length === 0) return;

      this.isRacing = true;
      this.currentRaceIndex = 0;
      this.raceResults = [];
      this.runNextRace();
    },

    runNextRace() {
      if (this.currentRaceIndex >= 6) {
        this.isRacing = false;
        return;
      }
      const race = this.raceSchedule[this.currentRaceIndex];
      if (!race) {
        this.isRacing = false;
        return;
      }
      race.status = "running";
    },

    resetRaces() {
      this.horses = [];
      this.raceSchedule = [];
      this.currentRaceIndex = 0;
      this.raceResults = [];
      this.isRacing = false;
      this.isGenerating = false;
    },
  },
});
