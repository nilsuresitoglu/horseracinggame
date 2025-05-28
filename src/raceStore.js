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

      this.raceSchedule = distances.map((distance, index) => {
        const shuffled = [...this.horses].sort(() => 0.5 - Math.random());
        return {
          raceNumber: index + 1,
          distance,
          participants: shuffled.slice(0, 10),
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

      const results = race.participants
        .map((horse) => ({
          ...horse,
          performance: horse.condition + Math.random() * 10,
        }))
        .sort((a, b) => b.performance - a.performance);

      setTimeout(() => {
        this.raceResults.push({
          raceNumber: race.raceNumber,
          distance: race.distance,
          results,
        });

        race.status = "completed";
        this.currentRaceIndex += 1;

        if (this.currentRaceIndex < 6) {
          setTimeout(() => this.runNextRace(), 2000);
        } else {
          this.isRacing = false;
        }
      }, 5000);
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
