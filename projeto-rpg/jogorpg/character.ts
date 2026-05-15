export abstract class Character {
    // Classe base com os atributos e regras compartilhadas por todos os lutadores.
    public name: string;
    protected strength: number;
    protected health: number;
    protected maxHealth: number;
    protected defense: number;
    protected heal: number;
    private hasUsedHeal: boolean = false;
    protected normalImage: string = "";
    protected lowHealthImage: string = "";
    private attackBuffs: number[] = [0, 10, 20, 30];

    constructor(
        name: string,
        strength: number,
        health: number,
        defense: number,
        heal: number,
        normalImage: string,
        lowHealthImage: string = ""
    ) {
        this.name = name;
        this.strength = strength;
        this.health = health;
        this.maxHealth = health;
        this.defense = defense;
        this.heal = heal;
        this.normalImage = normalImage;
        this.lowHealthImage = lowHealthImage;
    }

    public isAlive(): boolean {
        return this.health > 0;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public getHealthPercentage(): number {
        return (this.health / this.maxHealth) * 100;
    }

    public hasLowHealth(): boolean {
        return this.getHealthPercentage() <= 35 && this.isAlive();
    }

    public getImage(): string {
        if (this.hasLowHealth() && this.lowHealthImage.trim() !== "") {
            return this.lowHealthImage;
        }

        return this.normalImage;
    }

    public takeDamage(damage: number): void {
        // A defesa reduz o dano recebido, mas todo ataque causa pelo menos 1 de dano.
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

    public useHeal(): void {
        // Cada personagem pode se curar uma vez quando a vida chega a 50 ou menos.
        if (this.health <= 50 && !this.hasUsedHeal && this.isAlive()) {
            this.health = this.health + this.heal;

            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }

            this.hasUsedHeal = true;
            writeLog(this.name + " used heal and now has " + this.health + " health.");
        }
    }

    protected rollAttack(): number {
        // Sorteia uma variacao de ataque para personagens com golpes diferentes.
        return Math.floor(Math.random() * 3) + 1;
    }

    protected rollAttackBuff(): number {
        const buffIndex = Math.floor(Math.random() * this.attackBuffs.length);

        return this.attackBuffs[buffIndex];
    }

    protected dealAttackDamage(target: Character, baseDamage: number): void {
        const attackBuff = this.rollAttackBuff();

        if (attackBuff > 0) {
            writeLog(this.name + " received a +" + attackBuff + " attack buff.");
        }

        target.takeDamage(baseDamage + attackBuff);
    }

    public abstract attack(target: Character): void;
}

declare function writeLog(text: string): void;
