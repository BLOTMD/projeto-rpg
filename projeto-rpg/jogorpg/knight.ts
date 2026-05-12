import { Personagem } from "./personagem.ts";

export class Knight extends Personagem {
    // Cavaleiro: personagem mais resistente, com ataque direto de espada.
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
        // O cavaleiro usa sempre o mesmo golpe, baseado apenas na força.
        escreverLog(this.nome + " ataca com a espada.");
        persona.sofrerDano(this.forca);
    }
}

declare function escreverLog(texto: string): void;
