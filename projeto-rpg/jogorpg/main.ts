import { Wizard } from "./Characters/wizard.ts";
import { Knight } from "./Characters/knight.ts";
import { Assassin } from "./Characters/assassin.ts";
import { Toothless } from "./Characters/toothless.ts";
import { Archer } from "./Characters/archer.ts";
import { Character } from "./character.ts";

type CharacterType = "knight" | "wizard" | "assassin" | "toothless" | "archer";

type CharacterImages = {
    normal: string;
    lowHealth: string;
    attack: string;
};

type CharacterConstructor = new (
    name: string,
    strength: number,
    health: number,
    defense: number,
    heal: number,
    normalImage: string,
    lowHealthImage: string
) => Character;

type CharacterConfig = {
    CharacterClass: CharacterConstructor;
    name: string;
    strength: number;
    health: number;
    defense: number;
    heal: number;
};

// Centraliza as imagens usadas por cada personagem em estado normal, pouca vida e ataque.
const CHARACTER_IMAGES: Record<CharacterType, CharacterImages> = {
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

const CHARACTER_CONFIGS: Record<CharacterType, CharacterConfig> = {
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

let playerOne: Character;
let playerTwo: Character;
let playerOneType: CharacterType = "knight";
let playerTwoType: CharacterType = "wizard";
let currentTurn: number = 1;
let gameStarted: boolean = false;
let isPlayingTurn: boolean = false;

// Elementos principais da tela que controlam a escolha dos personagens e os turnos.
const startButton = document.getElementById("start-button") as HTMLButtonElement;
const nextTurnButton = document.getElementById("next-turn") as HTMLButtonElement;
const restartButton = document.getElementById("restart") as HTMLButtonElement;
const playerOneSelector = document.getElementById("PlayerOneSelect") as HTMLSelectElement;
const playerTwoSelector = document.getElementById("PlayerTwoSelect") as HTMLSelectElement;

startButton.addEventListener("click", startGame);
nextTurnButton.addEventListener("click", playTurn);
restartButton.addEventListener("click", restartGame);
playerOneSelector.addEventListener("change", changeCharactersBeforeBattle);
playerTwoSelector.addEventListener("change", changeCharactersBeforeBattle);

function createCharacter(type: CharacterType): Character {
    return buildCharacter(type);
}

function buildCharacter(type: CharacterType): Character {
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

    // Cria uma nova instância sempre que o jogo começa ou é reiniciado.

function getSelectedType(selector: HTMLSelectElement): CharacterType {
    // Garante que apenas tipos válidos sejam usados para criar personagens.
    const value = selector.value;

    if (value === "wizard" || value === "assassin" || value === "knight" || value === "toothless" || value === "archer") {
        return value;
    }

    return "knight";
}

function prepareCharactersFromSelectors(): void {
    // Lê os seletores da tela e monta os dois jogadores da luta.
    playerOneType = getSelectedType(playerOneSelector);
    playerTwoType = getSelectedType(playerTwoSelector);

    playerOne = createCharacter(playerOneType);
    playerTwo = createCharacter(playerTwoType);
}

function changeCharactersBeforeBattle(): void {
    // A troca só é permitida antes da batalha começar.
    if (gameStarted || isPlayingTurn) {
        return;
    }

    prepareCharactersFromSelectors();
    updateScreen();
}

function startGame(): void {
    // Prepara o estado inicial da partida e bloqueia as escolhas durante a batalha.
    prepareCharactersFromSelectors();
    currentTurn = 1;
    gameStarted = true;
    isPlayingTurn = false;

    const log = document.getElementById("log") as HTMLDivElement;
    log.innerHTML = "";

    writeLog("The battle has started!");
    writeLog("Player 1 chose: " + playerOne.name + ".");
    writeLog("Player 2 chose: " + playerTwo.name + ".");
    writeLog("Click NEXT TURN to continue.");

    startButton.disabled = true;
    nextTurnButton.disabled = false;
    playerOneSelector.disabled = true;
    playerTwoSelector.disabled = true;

    updateScreen();
}

async function playTurn(): Promise<void> {
    // Evita cliques repetidos enquanto as animações e ataques do turno estão acontecendo.
    if (!gameStarted || isPlayingTurn) {
        return;
    }

    isPlayingTurn = true;
    nextTurnButton.disabled = true;

    writeLog("---------------- Turn " + currentTurn + " ----------------");

    // Primeiro o jogador 1 ataca, depois o jogador 2 cura se estiver com pouca vida.
    await runAttackAnimation(
        "player-one-image",
        "player-two-image",
        "attacking-right",
        CHARACTER_IMAGES[playerOneType].attack,
        playerOne,
        function (): void {
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

    // Se o jogador 2 sobreviveu, ele contra-ataca o jogador 1.
    await runAttackAnimation(
        "player-two-image",
        "player-one-image",
        "attacking-left",
        CHARACTER_IMAGES[playerTwoType].attack,
        playerTwo,
        function (): void {
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

function endGame(winner: string): void {
    // Libera os botões para permitir uma nova partida após a vitória.
    updateScreen();

    writeLog("================ GAME OVER ================");
    writeLog(winner + " won the fight!");

    nextTurnButton.disabled = true;
    startButton.disabled = false;
    playerOneSelector.disabled = false;
    playerTwoSelector.disabled = false;
    gameStarted = false;
}

function restartGame(): void {
    // Volta o jogo para o estado de escolha de personagens.
    gameStarted = false;
    isPlayingTurn = false;
    currentTurn = 1;

    prepareCharactersFromSelectors();

    startButton.disabled = false;
    nextTurnButton.disabled = true;
    playerOneSelector.disabled = false;
    playerTwoSelector.disabled = false;

    const log = document.getElementById("log") as HTMLDivElement;
    log.innerHTML = "Choose the characters and click START to begin the battle.";

    removeAnimationClasses();
    updateScreen();
}

function updateScreen(ignoredImageId: string = ""): void {
    // Atualiza os dois cards da arena com vida, barra, imagem e efeitos visuais.
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

function updateCharacterCard(
    character: Character,
    nameId: string,
    hpId: string,
    healthBarId: string,
    imageId: string,
    cardId: string,
    ignoredImageId: string
): void {
    // Centraliza a atualização visual de um personagem para evitar repetição de código.
    const name = document.getElementById(nameId) as HTMLElement;
    const hp = document.getElementById(hpId) as HTMLElement;

    name.textContent = character.name;
    hp.textContent = "HP: " + character.getHealth() + " / " + character.getMaxHealth();

    updateHealthBar(healthBarId, character);

    if (imageId !== ignoredImageId) {
        updateCharacterImage(imageId, cardId, character);
    } else {
        updateLowHealthCard(cardId, character);
    }
}

function updateHealthBar(healthBarId: string, character: Character): void {
    // A cor da barra muda conforme a porcentagem de vida restante.
    const healthBar = document.getElementById(healthBarId) as HTMLDivElement;
    const percentage = character.getHealthPercentage();

    healthBar.style.width = percentage + "%";
    healthBar.classList.remove("health-yellow", "health-red");

    if (percentage <= 35) {
        healthBar.classList.add("health-red");
    } else if (percentage <= 60) {
        healthBar.classList.add("health-yellow");
    }
}

function updateCharacterImage(imageId: string, cardId: string, character: Character): void {
    // Troca a imagem normal pela imagem de pouca vida quando necessário.
    const image = document.getElementById(imageId) as HTMLImageElement;
    const newImage = character.getImage();

    if (image.getAttribute("src") !== newImage) {
        image.setAttribute("src", newImage);
    }

    image.setAttribute("alt", character.name);
    updateLowHealthCard(cardId, character);
}

function updateLowHealthCard(cardId: string, character: Character): void {
    // A classe vida-baixa permite destacar o card pelo CSS.
    const card = document.getElementById(cardId) as HTMLDivElement;

    if (character.hasLowHealth()) {
        card.classList.add("low-health");
    } else {
        card.classList.remove("low-health");
    }
}

async function runAttackAnimation(
    attackerImageId: string,
    defenderImageId: string,
    attackClass: string,
    attackImage: string,
    attacker: Character,
    attackAction: () => void
): Promise<void> {
    // Controla a sequência visual: prepara animação, aplica dano e restaura a imagem.
    const attackerImage = document.getElementById(attackerImageId) as HTMLImageElement;
    const defenderImage = document.getElementById(defenderImageId) as HTMLImageElement;

    attackerImage.classList.remove(attackClass);
    defenderImage.classList.remove("taking-damage");

    // Força o navegador a reiniciar a animação mesmo quando a mesma classe é usada de novo.
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

function removeAnimationClasses(): void {
    // Limpa efeitos visuais para o reinício começar sem animações antigas presas na tela.
    const playerOneImage = document.getElementById("player-one-image") as HTMLImageElement;
    const playerTwoImage = document.getElementById("player-two-image") as HTMLImageElement;

    playerOneImage.classList.remove("attacking-right", "attacking-left", "taking-damage");
    playerTwoImage.classList.remove("attacking-right", "attacking-left", "taking-damage");
}

function wait(time: number): Promise<void> {
    // Pequena pausa usada para sincronizar as animações com a lógica do turno.
    return new Promise(function (resolve): void {
        setTimeout(resolve, time);
    });
}

function writeLog(text: string): void {
    // Mostra a mensagem no console visual da página e também no console do navegador.
    const log = document.getElementById("log") as HTMLDivElement;

    log.innerHTML += "<div class='log-line'>" + text + "</div>";
    log.scrollTop = log.scrollHeight;

    console.log(text);
}

(window as any).writeLog = writeLog;

restartGame();
