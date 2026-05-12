import { Personagem } from "./personagem.ts";

export class Assassino extends Personagem {
    // Assassino: personagem equilibrado, com chance de causar golpes mais fortes.
    constructor(
        nome: string,
        forca: number,
        vida: number,
        defesa: number,
        cura: number,
        imagemNormal: string,
        imagemPoucaVida: string = ""
    ) {
        super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }

    public atacar(persona: Personagem): void {
        // Sorteia entre ataque simples, ataque rápido e golpe crítico.
        const golpe = this.gerarAtaque();

        if (golpe === 1) {
            escreverLog(this.nome + " ataca com a adaga.");
            persona.sofrerDano(this.forca);
        } else if (golpe === 2) {
            escreverLog(this.nome + " faz um corte rápido.");
            persona.sofrerDano(this.forca + 15);
        } else {
            escreverLog(this.nome + " acerta um golpe crítico pelas sombras.");
            persona.sofrerDano(this.forca + 30);
        }
    }
}

declare function escreverLog(texto: string): void;
