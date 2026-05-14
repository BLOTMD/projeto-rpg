import { Personagem } from "../personagem.ts";

export class Arqueiro extends Personagem {
    // Arqueiro: lutador de alcance, com dano moderado e boa cura de seguranca.
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
        // Sorteia uma flecha elemental para variar o ataque do turno.
        const tiro = this.gerarAtaque();

        if (tiro === 1) {
            escreverLog(this.nome + " ataca com flecha de fogo.");
            persona.sofrerDano(this.forca + 30);
        } else if (tiro === 2) {
            escreverLog(this.nome + " ataca com flecha de raio.");
            persona.sofrerDano(this.forca + 35);
        } else {
            escreverLog(this.nome + " ataca com flecha de gelo.");
            persona.sofrerDano(this.forca + 20);
        }
    }
}

declare function escreverLog(texto: string): void;
