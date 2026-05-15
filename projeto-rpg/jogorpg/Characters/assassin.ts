import { Character } from "../character.ts";

export class Assassin extends Character {
    // Assassino: personagem agil, com vida media e chance de golpe critico.
    constructor(
        name: string,
        strength: number,
        health: number,
        defense: number,
        heal: number,
        normalImage: string,
        lowHealthImage: string,
    ) {
        super(name, strength, health, defense, heal, normalImage, lowHealthImage);
    }

    public attack(target: Character): void {
        // Sorteia entre ataque simples, ataque rapido e golpe critico.
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
}

declare function writeLog(text: string): void;
