(() => {
  // character.ts
  var Character = class {
    // Classe base com os atributos e regras compartilhadas por todos os lutadores.
    name;
    strength;
    health;
    maxHealth;
    defense;
    heal;
    hasUsedHeal = false;
    normalImage = "";
    lowHealthImage = "";
    attackBuffs = [0, 10, 20, 30];
    constructor(name, strength, health, defense, heal, normalImage, lowHealthImage = "") {
      this.name = name;
      this.strength = strength;
      this.health = health;
      this.maxHealth = health;
      this.defense = defense;
      this.heal = heal;
      this.normalImage = normalImage;
      this.lowHealthImage = lowHealthImage;
    }
    isAlive() {
      return this.health > 0;
    }
    getHealth() {
      return this.health;
    }
    getMaxHealth() {
      return this.maxHealth;
    }
    getHealthPercentage() {
      return this.health / this.maxHealth * 100;
    }
    hasLowHealth() {
      return this.getHealthPercentage() <= 35 && this.isAlive();
    }
    getImage() {
      if (this.hasLowHealth() && this.lowHealthImage.trim() !== "") {
        return this.lowHealthImage;
      }
      return this.normalImage;
    }
    takeDamage(damage) {
      let finalDamage = damage - this.defense;
      if (finalDamage < 1) {
        finalDamage = 1;
      }
      this.health = this.health - finalDamage;
      if (this.health < 0) {
        this.health = 0;
      }
      writeLog(this.name + " took " + finalDamage + " damage. Current health: " + this.health);
    }
    useHeal() {
      if (this.health <= 50 && !this.hasUsedHeal && this.isAlive()) {
        this.health = this.health + this.heal;
        if (this.health > this.maxHealth) {
          this.health = this.maxHealth;
        }
        this.hasUsedHeal = true;
        writeLog(this.name + " used heal and now has " + this.health + " health.");
      }
    }
    rollAttack() {
      return Math.floor(Math.random() * 3) + 1;
    }
    rollAttackBuff() {
      const buffIndex = Math.floor(Math.random() * this.attackBuffs.length);
      return this.attackBuffs[buffIndex];
    }
    dealAttackDamage(target, baseDamage) {
      const attackBuff = this.rollAttackBuff();
      if (attackBuff > 0) {
        writeLog(this.name + " received a +" + attackBuff + " attack buff.");
      }
      target.takeDamage(baseDamage + attackBuff);
    }
  };

  // Characters/wizard.ts
  var Wizard = class extends Character {
    // Mago: alto dano e cura forte, mas pouca vida e baixa defesa.
    constructor(name, strength, health, defense, heal, normalImage, lowHealthImage) {
      super(name, strength, health, defense, heal, normalImage, lowHealthImage);
    }
    attack(target) {
      const spell = this.rollAttack();
      switch (spell) {
        case 1:
          writeLog(this.name + " attacks with fire.");
          this.dealAttackDamage(target, this.strength);
          break;
        case 2:
          writeLog(this.name + " attacks with earth.");
          this.dealAttackDamage(target, this.strength);
          break;
        default:
          writeLog(this.name + " attacks with ice.");
          this.dealAttackDamage(target, this.strength);
          break;
      }
    }
  };

  // Characters/knight.ts
  var Knight = class extends Character {
    // Cavaleiro: tanque da arena, com muita vida, alta defesa e dano mais estavel.
    constructor(name, strength, health, defense, heal, normalImage, lowHealthImage) {
      super(name, strength, health, defense, heal, normalImage, lowHealthImage);
    }
    attack(target) {
      writeLog(this.name + " attacks with a sword.");
      this.dealAttackDamage(target, this.strength);
    }
  };

  // Characters/assassin.ts
  var Assassin = class extends Character {
    // Assassino: personagem agil, com vida media e chance de golpe critico.
    constructor(name, strength, health, defense, heal, normalImage, lowHealthImage) {
      super(name, strength, health, defense, heal, normalImage, lowHealthImage);
    }
    attack(target) {
      const strike = this.rollAttack();
      switch (strike) {
        case 1:
          writeLog(this.name + " attacks with a dagger.");
          this.dealAttackDamage(target, this.strength);
          break;
        case 2:
          writeLog(this.name + " lands a quick slash.");
          this.dealAttackDamage(target, this.strength);
          break;
        default:
          writeLog(this.name + " lands a critical strike from the shadows.");
          this.dealAttackDamage(target, this.strength);
          break;
      }
    }
  };

  // Characters/toothless.ts
  var Toothless = class extends Character {
    // Banguela: atacante pesado, com bons golpes elementais e cura menor.
    constructor(name, strength, health, defense, heal, normalImage, lowHealthImage) {
      super(name, strength, health, defense, heal, normalImage, lowHealthImage);
    }
    attack(target) {
      const breath = this.rollAttack();
      switch (breath) {
        case 1:
          writeLog(this.name + " attacks with plasma breath.");
          this.dealAttackDamage(target, this.strength);
          break;
        case 2:
          writeLog(this.name + " attacks with electric breath.");
          this.dealAttackDamage(target, this.strength);
          break;
        default:
          writeLog(this.name + " attacks with ice breath.");
          this.dealAttackDamage(target, this.strength);
          break;
      }
    }
  };

  // Characters/archer.ts
  var Archer = class extends Character {
    // Arqueiro: lutador de alcance, com dano moderado e boa cura de seguranca.
    constructor(name, strength, health, defense, heal, normalImage, lowHealthImage) {
      super(name, strength, health, defense, heal, normalImage, lowHealthImage);
    }
    attack(target) {
      const shot = this.rollAttack();
      switch (shot) {
        case 1:
          writeLog(this.name + " attacks with a fire arrow.");
          this.dealAttackDamage(target, this.strength);
          break;
        case 2:
          writeLog(this.name + " attacks with a lightning arrow.");
          this.dealAttackDamage(target, this.strength);
          break;
        default:
          writeLog(this.name + " attacks with an ice arrow.");
          this.dealAttackDamage(target, this.strength);
          break;
      }
    }
  };

  // main.ts
  var CHARACTER_IMAGES = {
    knight: {
      normal: "https://static.wikia.nocookie.net/sss/images/3/33/Knight1.jpg/revision/latest?cb=20180424234257&path-prefix=pt-br",
      lowHealth: "images/knight.lowHp.png",
      attack: "images/knight.attack.png"
    },
    wizard: {
      normal: "https://preview.redd.it/i-am-going-for-a-full-mage-build-how-many-magic-and-health-v0-vnwm78x1apqe1.jpeg?auto=webp&s=29a3f57f4f5b6068fc69fff73ab3ab6d78a2a8bf",
      lowHealth: "images/wizard.lowHp.png",
      attack: "images/wizard.attack.png"
    },
    assassin: {
      normal: "images/assassin.normal.webp",
      lowHealth: "images/assassin.lowHp.png",
      attack: "images/assassin.attack.png"
    },
    toothless: {
      normal: "images/toothless.normal.png",
      lowHealth: "images/toothless.lowHp.jpg",
      attack: "images/toothless.attack.png"
    },
    archer: {
      normal: "images/archer.normal.png",
      lowHealth: "images/archer.lowHp.png",
      attack: "images/archer.attack.webp"
    }
  };
  var CHARACTER_CONFIGS = {
    knight: {
      CharacterClass: Knight,
      name: "Knight",
      strength: 75,
      health: 360,
      defense: 60,
      heal: 70
    },
    wizard: {
      CharacterClass: Wizard,
      name: "Wizard",
      strength: 95,
      health: 190,
      defense: 15,
      heal: 150
    },
    assassin: {
      CharacterClass: Assassin,
      name: "Assassin",
      strength: 70,
      health: 230,
      defense: 25,
      heal: 80
    },
    toothless: {
      CharacterClass: Toothless,
      name: "Toothless",
      strength: 105,
      health: 240,
      defense: 35,
      heal: 60
    },
    archer: {
      CharacterClass: Archer,
      name: "Archer",
      strength: 65,
      health: 220,
      defense: 20,
      heal: 100
    }
  };
  var playerOne;
  var playerTwo;
  var playerOneType = "knight";
  var playerTwoType = "wizard";
  var currentTurn = 1;
  var gameStarted = false;
  var isPlayingTurn = false;
  var startButton = document.getElementById("start-button");
  var nextTurnButton = document.getElementById("next-turn");
  var restartButton = document.getElementById("restart");
  var playerOneSelector = document.getElementById("PlayerOneSelect");
  var playerTwoSelector = document.getElementById("PlayerTwoSelect");
  startButton.addEventListener("click", startGame);
  nextTurnButton.addEventListener("click", playTurn);
  restartButton.addEventListener("click", restartGame);
  playerOneSelector.addEventListener("change", changeCharactersBeforeBattle);
  playerTwoSelector.addEventListener("change", changeCharactersBeforeBattle);
  function createCharacter(type) {
    return buildCharacter(type);
  }
  function buildCharacter(type) {
    const config = CHARACTER_CONFIGS[type];
    const images = CHARACTER_IMAGES[type];
    return new config.CharacterClass(
      config.name,
      config.strength,
      config.health,
      config.defense,
      config.heal,
      images.normal,
      images.lowHealth
    );
  }
  function getSelectedType(selector) {
    const value = selector.value;
    if (value === "wizard" || value === "assassin" || value === "knight" || value === "toothless" || value === "archer") {
      return value;
    }
    return "knight";
  }
  function prepareCharactersFromSelectors() {
    playerOneType = getSelectedType(playerOneSelector);
    playerTwoType = getSelectedType(playerTwoSelector);
    playerOne = createCharacter(playerOneType);
    playerTwo = createCharacter(playerTwoType);
  }
  function changeCharactersBeforeBattle() {
    if (gameStarted || isPlayingTurn) {
      return;
    }
    prepareCharactersFromSelectors();
    updateScreen();
  }
  function startGame() {
    prepareCharactersFromSelectors();
    currentTurn = 1;
    gameStarted = true;
    isPlayingTurn = false;
    const log = document.getElementById("log");
    log.innerHTML = "";
    writeLog2("The battle has started!");
    writeLog2("Player 1 chose: " + playerOne.name + ".");
    writeLog2("Player 2 chose: " + playerTwo.name + ".");
    writeLog2("Click NEXT TURN to continue.");
    startButton.disabled = true;
    nextTurnButton.disabled = false;
    playerOneSelector.disabled = true;
    playerTwoSelector.disabled = true;
    updateScreen();
  }
  async function playTurn() {
    if (!gameStarted || isPlayingTurn) {
      return;
    }
    isPlayingTurn = true;
    nextTurnButton.disabled = true;
    writeLog2("---------------- Turn " + currentTurn + " ----------------");
    await runAttackAnimation(
      "player-one-image",
      "player-two-image",
      "attacking-right",
      CHARACTER_IMAGES[playerOneType].attack,
      playerOne,
      function() {
        playerOne.attack(playerTwo);
      }
    );
    playerTwo.useHeal();
    updateScreen();
    if (!playerTwo.isAlive()) {
      endGame(playerOne.name);
      isPlayingTurn = false;
      return;
    }
    await wait(250);
    await runAttackAnimation(
      "player-two-image",
      "player-one-image",
      "attacking-left",
      CHARACTER_IMAGES[playerTwoType].attack,
      playerTwo,
      function() {
        playerTwo.attack(playerOne);
      }
    );
    playerOne.useHeal();
    updateScreen();
    if (!playerOne.isAlive()) {
      endGame(playerTwo.name);
      isPlayingTurn = false;
      return;
    }
    currentTurn = currentTurn + 1;
    isPlayingTurn = false;
    nextTurnButton.disabled = false;
    updateScreen();
  }
  function endGame(winner) {
    updateScreen();
    writeLog2("================ GAME OVER ================");
    writeLog2(winner + " won the fight!");
    nextTurnButton.disabled = true;
    startButton.disabled = false;
    playerOneSelector.disabled = false;
    playerTwoSelector.disabled = false;
    gameStarted = false;
  }
  function restartGame() {
    gameStarted = false;
    isPlayingTurn = false;
    currentTurn = 1;
    prepareCharactersFromSelectors();
    startButton.disabled = false;
    nextTurnButton.disabled = true;
    playerOneSelector.disabled = false;
    playerTwoSelector.disabled = false;
    const log = document.getElementById("log");
    log.innerHTML = "Choose the characters and click START to begin the battle.";
    removeAnimationClasses();
    updateScreen();
  }
  function updateScreen(ignoredImageId = "") {
    if (!playerOne || !playerTwo) {
      return;
    }
    updateCharacterCard(
      playerOne,
      "player-one-name",
      "player-one-hp",
      "player-one-health-bar",
      "player-one-image",
      "player-one-card",
      ignoredImageId
    );
    updateCharacterCard(
      playerTwo,
      "player-two-name",
      "player-two-hp",
      "player-two-health-bar",
      "player-two-image",
      "player-two-card",
      ignoredImageId
    );
  }
  function updateCharacterCard(character, nameId, hpId, healthBarId, imageId, cardId, ignoredImageId) {
    const name = document.getElementById(nameId);
    const hp = document.getElementById(hpId);
    name.textContent = character.name;
    hp.textContent = "HP: " + character.getHealth() + " / " + character.getMaxHealth();
    updateHealthBar(healthBarId, character);
    if (imageId !== ignoredImageId) {
      updateCharacterImage(imageId, cardId, character);
    } else {
      updateLowHealthCard(cardId, character);
    }
  }
  function updateHealthBar(healthBarId, character) {
    const healthBar = document.getElementById(healthBarId);
    const percentage = character.getHealthPercentage();
    healthBar.style.width = percentage + "%";
    healthBar.classList.remove("health-yellow", "health-red");
    if (percentage <= 35) {
      healthBar.classList.add("health-red");
    } else if (percentage <= 60) {
      healthBar.classList.add("health-yellow");
    }
  }
  function updateCharacterImage(imageId, cardId, character) {
    const image = document.getElementById(imageId);
    const newImage = character.getImage();
    if (image.getAttribute("src") !== newImage) {
      image.setAttribute("src", newImage);
    }
    image.setAttribute("alt", character.name);
    updateLowHealthCard(cardId, character);
  }
  function updateLowHealthCard(cardId, character) {
    const card = document.getElementById(cardId);
    if (character.hasLowHealth()) {
      card.classList.add("low-health");
    } else {
      card.classList.remove("low-health");
    }
  }
  async function runAttackAnimation(attackerImageId, defenderImageId, attackClass, attackImage, attacker, attackAction) {
    const attackerImage = document.getElementById(attackerImageId);
    const defenderImage = document.getElementById(defenderImageId);
    attackerImage.classList.remove(attackClass);
    defenderImage.classList.remove("taking-damage");
    void attackerImage.offsetWidth;
    if (attackImage.trim() !== "") {
      attackerImage.setAttribute("src", attackImage);
    }
    attackerImage.classList.add(attackClass);
    await wait(520);
    attackAction();
    defenderImage.classList.add("taking-damage");
    updateScreen(attackerImageId);
    await wait(520);
    attackerImage.classList.remove(attackClass);
    defenderImage.classList.remove("taking-damage");
    attackerImage.setAttribute("src", attacker.getImage());
    updateScreen();
  }
  function removeAnimationClasses() {
    const playerOneImage = document.getElementById("player-one-image");
    const playerTwoImage = document.getElementById("player-two-image");
    playerOneImage.classList.remove("attacking-right", "attacking-left", "taking-damage");
    playerTwoImage.classList.remove("attacking-right", "attacking-left", "taking-damage");
  }
  function wait(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }
  function writeLog2(text) {
    const log = document.getElementById("log");
    log.innerHTML += "<div class='log-line'>" + text + "</div>";
    log.scrollTop = log.scrollHeight;
    console.log(text);
  }
  window.writeLog = writeLog2;
  restartGame();
})();
