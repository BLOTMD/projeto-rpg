import { Personagem } from "../personagem.ts";

export class Banguela extends Personagem {
    // Banguela: atacante pesado, com bons golpes elementais e cura menor.
    constructor(
        nome: string,
        forca: number,
        vida: number,
        defesa: number,
        cura: number,
        imagemNormal: string,
        imagemPoucaVida: string,
    ) {
        super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }

    public atacar(persona: Personagem): void {
        // Sorteia o tipo de bafo para variar o dano causado no turno.
        const bafo = this.gerarAtaque();

        if (bafo === 1) {
            escreverLog(this.nome + " ataca com bafo de plasma.");
            persona.sofrerDano(this.forca + 40);
        } else if (bafo === 2) {
            escreverLog(this.nome + " ataca com bafo eletrico.");
            persona.sofrerDano(this.forca + 35);
        } else {
            escreverLog(this.nome + " ataca com bafo de gelo.");
            persona.sofrerDano(this.forca + 30);
        }
    }
}

declare function escreverLog(texto: string): void;
