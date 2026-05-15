import { Character } from "../character.ts";

export class Wizard extends Character {
    // Mago: alto dano e cura forte, mas pouca vida e baixa defesa.
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
        // Sorteia a magia do turno entre fogo, terra e gelo.
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
}

declare function writeLog(text: string): void;
