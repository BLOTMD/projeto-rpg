import { Character } from "../character.ts";

export class Toothless extends Character {
    // Banguela: atacante pesado, com bons golpes elementais e cura menor.
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
        // Sorteia o tipo de bafo para variar o dano causado no turno.
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
}

declare function writeLog(text: string): void;
