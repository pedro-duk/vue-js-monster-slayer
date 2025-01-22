const specialAttackCharge = 2;
const playerMaxHealth = 100;
const monsterMaxHealth = 100;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: playerMaxHealth,
      monsterHealth: monsterMaxHealth,
      currentRound: 0,
      lastSpecialAttackRound: 0,
      winner: null,
      logMessages: [],
    };
  },

  methods: {
    startGame() {
      this.playerHealth = playerMaxHealth;
      this.monsterHealth = monsterMaxHealth;
      this.currentRound = 0;
      this.lastSpecialAttackRound = 0;
      this.winner = null;
      this.logMessages = [];
    },

    attackMonster() {
      const attackValue = Math.min(
        this.playerHealth,
        randomIntFromInterval(5, 12)
      );

      this.monsterHealth -= attackValue;

      this.addLogMessage("player", "attack", attackValue);

      this.attackPlayer();
    },

    specialAttackMonster() {
      const attackValue = Math.min(
        this.playerHealth,
        randomIntFromInterval(10, 25)
      );

      this.monsterHealth -= attackValue;

      this.lastSpecialAttackRound = this.currentRound;
      
      this.addLogMessage("player", "special-attack", attackValue);

      this.attackPlayer();
    },

    healPlayer() {
      const healValue = Math.min(
        playerMaxHealth - this.playerHealth,
        randomIntFromInterval(8, 20)
      );

      this.playerHealth += healValue;

      this.addLogMessage("player", "heal", healValue);

      this.attackPlayer();
    },

    attackPlayer() {
      const attackValue = Math.min(
        this.playerHealth,
        randomIntFromInterval(8, 15)
      );

      this.playerHealth -= attackValue;

      this.addLogMessage("monster", "attack", attackValue);

      this.currentRound++;
    },

    surrender() {
      this.winner = "monster";
    },

    addLogMessage(actionBy, actionType, actionValue) {
      this.logMessages.unshift({
        actionBy,
        actionType,
        actionValue,
      });
    },
  },

  computed: {
    monsterBarStyles() {
      return { width: Math.max(0, this.monsterHealth) + "%" };
    },

    playerBarStyles() {
      return { width: Math.max(0, this.playerHealth) + "%" };
    },

    specialAttackText() {
      if (this.specialAttackReady) return "IS READY";
      return (
        "IN " +
        (
          this.lastSpecialAttackRound -
          this.currentRound +
          specialAttackCharge +
          1
        ).toString()
      );
    },

    specialAttackReady() {
      return (
        this.currentRound - this.lastSpecialAttackRound > specialAttackCharge
      );
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },

    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
});

app.mount("#game");
