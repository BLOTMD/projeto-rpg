export abstract class Personagem {
    // Classe base com os atributos e regras compartilhadas por todos os lutadores.
    public nome: string;
    protected forca: number;
    protected vida: number;
    protected vidaMaxima: number;
    protected defesa: number;
    protected cura: number;
    private jaUsouCura: boolean = false;
    protected imagemNormal: string = "";
    protected imagemPoucaVida: string = "";

    constructor(
        nome: string,
        forca: number,
        vida: number,
        defesa: number,
        cura: number,
        imagemNormal: string,
        imagemPoucaVida: string = ""
    ) {
        this.nome = nome;
        this.forca = forca;
        this.vida = vida;
        this.vidaMaxima = vida;
        this.defesa = defesa;
        this.cura = cura;
        this.imagemNormal = imagemNormal;
        this.imagemPoucaVida = imagemPoucaVida;
    }

    public continuaVivo(): boolean {
        return this.vida > 0;
    }

    public getVida(): number {
        return this.vida;
    }

    public getVidaMaxima(): number {
        return this.vidaMaxima;
    }

    public getPorcentagemVida(): number {
        return (this.vida / this.vidaMaxima) * 100;
    }

    public estaComPoucaVida(): boolean {
        return this.getPorcentagemVida() <= 35 && this.continuaVivo();
    }

    public getImg(): string {
        if (this.estaComPoucaVida() && this.imagemPoucaVida.trim() !== "") {
            return this.imagemPoucaVida;
        }

        return this.imagemNormal;
    }

    public sofrerDano(dano: number): void {
        // A defesa reduz o dano recebido, mas todo ataque causa pelo menos 1 de dano.
        let danoFinal = dano - this.defesa;

        if (danoFinal < 1) {
            danoFinal = 1;
        }

        this.vida = this.vida - danoFinal;

        if (this.vida < 0) {
            this.vida = 0;
        }

        escreverLog(this.nome + " recebeu " + danoFinal + " de dano. Vida atual: " + this.vida);
    }

    public usarCura(): void {
        // Cada personagem pode se curar apenas uma vez quando a vida chega a 50 ou menos.
        if (this.vida <= 50 && !this.jaUsouCura && this.continuaVivo()) {
            this.vida = this.vida + this.cura;

            if (this.vida > this.vidaMaxima) {
                this.vida = this.vidaMaxima;
            }

            this.jaUsouCura = true;
            escreverLog(this.nome + " usou cura e ficou com " + this.vida + " de vida.");
        }
    }

    protected gerarAtaque(): number {
        // Sorteia uma variação de ataque para personagens com golpes diferentes.
        return Math.floor(Math.random() * 3) + 1;
    }

    public abstract atacar(persona: Personagem): void;
}

declare function escreverLog(texto: string): void;
