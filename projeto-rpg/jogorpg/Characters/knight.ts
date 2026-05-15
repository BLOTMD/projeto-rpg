import { Character } from "../character.ts";

export class Knight extends Character {
    // Cavaleiro: tanque da arena, com muita vida, alta defesa e dano mais estavel.
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
        // Usa sempre o mesmo golpe, baseado na forca do personagem.
        writeLog(this.name + " attacks with a sword.");
        this.dealAttackDamage(target, this.strength);
    }
}

declare function writeLog(text: string): void;
