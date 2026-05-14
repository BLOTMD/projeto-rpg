import { Personagem } from "../personagem.ts";

export class Wizard extends Personagem {
    // Mago: alto dano e cura forte, mas pouca vida e baixa defesa.
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
        // Sorteia a magia do turno entre fogo, terra e gelo.
        const magia = this.gerarAtaque();

        if (magia === 1) {
            escreverLog(this.nome + " ataca com fogo.");
            persona.sofrerDano(this.forca + 30);
        } else if (magia === 2) {
            escreverLog(this.nome + " ataca com terra.");
            persona.sofrerDano(this.forca + 15);
        } else {
            escreverLog(this.nome + " ataca com gelo.");
            persona.sofrerDano(this.forca + 20);
        }
    }
}

declare function escreverLog(texto: string): void;
