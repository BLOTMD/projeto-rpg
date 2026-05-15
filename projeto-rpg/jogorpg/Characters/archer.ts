import { Character } from "../character.ts";

export class Archer extends Character {
    // Arqueiro: lutador de alcance, com dano moderado e boa cura de seguranca.
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
        // Sorteia uma flecha elemental para variar o ataque do turno.
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
}

declare function writeLog(text: string): void;
