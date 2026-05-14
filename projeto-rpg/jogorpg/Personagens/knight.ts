import { Personagem } from "../personagem.ts";

export class Knight extends Personagem {
    // Cavaleiro: tanque da arena, com muita vida, alta defesa e dano mais estavel.
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
        // Usa sempre o mesmo golpe, baseado na forca do personagem.
        escreverLog(this.nome + " ataca com a espada.");
        persona.sofrerDano(this.forca);
    }
}

declare function escreverLog(texto: string): void;
