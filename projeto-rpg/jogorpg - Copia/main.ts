import { Wizard } from "./wizard.ts";
import { Knight } from "./knight.ts";
import { Assassino } from "./assassino.ts";
import { Personagem } from "./personagem.ts";

type TipoPersonagem = "cavaleiro" | "mago" | "assassino";

type ImagensPersonagem = {
    normal: string;
    poucaVida: string;
    ataque: string;
};

// Mapa usado para trocar as imagens conforme o personagem e o estado da batalha.
const IMAGENS_PERSONAGENS: Record<TipoPersonagem, ImagensPersonagem> = {
    cavaleiro: {
        normal: "https://static.wikia.nocookie.net/sss/images/3/33/Knight1.jpg/revision/latest?cb=20180424234257&path-prefix=pt-br",
        poucaVida: "imagens/cavaleiro.lowHp.png",
        ataque: "imagens/cavaleiro.ataque.png"
    },
    mago: {
        normal: "https://preview.redd.it/i-am-going-for-a-full-mage-build-how-many-magic-and-health-v0-vnwm78x1apqe1.jpeg?auto=webp&s=29a3f57f4f5b6068fc69fff73ab3ab6d78a2a8bf",
        poucaVida: "imagens/mago.lowHp.png",
        ataque: "imagens/mago.ataque.png"
    },
    assassino: {
        normal: "imagens/assassino.normal.webp",
        poucaVida: "imagens/assassino.lowHp.png",
        ataque: "imagens/assassino.ataque.png"
    }
};

let jogadorUm: Personagem;
let jogadorDois: Personagem;
let tipoJogadorUm: TipoPersonagem = "cavaleiro";
let tipoJogadorDois: TipoPersonagem = "mago";
let turno: number = 1;
let jogoComecou: boolean = false;
let jogandoTurno: boolean = false;

// Elementos principais da tela que controlam a escolha dos personagens e os turnos.
const botaoStart = document.getElementById("botaojogar") as HTMLButtonElement;
const botaoProximo = document.getElementById("proximo") as HTMLButtonElement;
const botaoReiniciar = document.getElementById("reiniciar") as HTMLButtonElement;
const seletorJogadorUm = document.getElementById("Trocar1") as HTMLSelectElement;
const seletorJogadorDois = document.getElementById("Trocar2") as HTMLSelectElement;

botaoStart.addEventListener("click", iniciarJogo);
botaoProximo.addEventListener("click", jogarTurno);
botaoReiniciar.addEventListener("click", reiniciarJogo);
seletorJogadorUm.addEventListener("change", trocarPersonagensAntesDaLuta);
seletorJogadorDois.addEventListener("change", trocarPersonagensAntesDaLuta);

function criarPersonagem(tipo: TipoPersonagem): Personagem {
    // Cria uma nova instância sempre que o jogo começa ou é reiniciado.
    if (tipo === "cavaleiro") {
        return new Knight(
            "Cavaleiro",
            60,
            300,
            50,
            100,
            IMAGENS_PERSONAGENS.cavaleiro.normal,
            IMAGENS_PERSONAGENS.cavaleiro.poucaVida
        );
    }

    if (tipo === "mago") {
        return new Wizard(
            "Mago",
            90,
            200,
            20,
            150,
            IMAGENS_PERSONAGENS.mago.normal,
            IMAGENS_PERSONAGENS.mago.poucaVida
        );
    }

    return new Assassino(
        "Assassino",
        85,
        250,
        30,
        90,
        IMAGENS_PERSONAGENS.assassino.normal,
        IMAGENS_PERSONAGENS.assassino.poucaVida
    );
}

function getTipoSelecionado(seletor: HTMLSelectElement): TipoPersonagem {
    // Garante que apenas tipos válidos sejam usados para criar personagens.
    const valor = seletor.value;

    if (valor === "mago" || valor === "assassino" || valor === "cavaleiro") {
        return valor;
    }

    return "cavaleiro";
}

function prepararPersonagensPelosSeletores(): void {
    // Lê os seletores da tela e monta os dois jogadores da luta.
    tipoJogadorUm = getTipoSelecionado(seletorJogadorUm);
    tipoJogadorDois = getTipoSelecionado(seletorJogadorDois);

    jogadorUm = criarPersonagem(tipoJogadorUm);
    jogadorDois = criarPersonagem(tipoJogadorDois);
}

function trocarPersonagensAntesDaLuta(): void {
    // A troca só é permitida antes da batalha começar.
    if (jogoComecou || jogandoTurno) {
        return;
    }

    prepararPersonagensPelosSeletores();
    atualizarTela();
}

function iniciarJogo(): void {
    // Prepara o estado inicial da partida e bloqueia as escolhas durante a batalha.
    prepararPersonagensPelosSeletores();
    turno = 1;
    jogoComecou = true;
    jogandoTurno = false;

    const log = document.getElementById("log") as HTMLDivElement;
    log.innerHTML = "";

    escreverLog("A batalha começou!");
    escreverLog("Jogador 1 escolheu: " + jogadorUm.nome + ".");
    escreverLog("Jogador 2 escolheu: " + jogadorDois.nome + ".");
    escreverLog("Clique em PRÓXIMO TURNO para continuar.");

    botaoStart.disabled = true;
    botaoProximo.disabled = false;
    seletorJogadorUm.disabled = true;
    seletorJogadorDois.disabled = true;

    atualizarTela();
}

async function jogarTurno(): Promise<void> {
    // Evita cliques repetidos enquanto as animações e ataques do turno estão acontecendo.
    if (!jogoComecou || jogandoTurno) {
        return;
    }

    jogandoTurno = true;
    botaoProximo.disabled = true;

    escreverLog("---------------- Turno " + turno + " ----------------");

    // Primeiro o jogador 1 ataca, depois o jogador 2 cura se estiver com pouca vida.
    await executarAnimacaoAtaque(
        "imgjoggadorUm",
        "imgjoggadorDois",
        "atacando-direita",
        IMAGENS_PERSONAGENS[tipoJogadorUm].ataque,
        jogadorUm,
        function (): void {
            jogadorUm.atacar(jogadorDois);
        }
    );

    jogadorDois.usarCura();
    atualizarTela();

    if (!jogadorDois.continuaVivo()) {
        finalizarJogo(jogadorUm.nome);
        jogandoTurno = false;
        return;
    }

    await esperar(250);

    // Se o jogador 2 sobreviveu, ele contra-ataca o jogador 1.
    await executarAnimacaoAtaque(
        "imgjoggadorDois",
        "imgjoggadorUm",
        "atacando-esquerda",
        IMAGENS_PERSONAGENS[tipoJogadorDois].ataque,
        jogadorDois,
        function (): void {
            jogadorDois.atacar(jogadorUm);
        }
    );

    jogadorUm.usarCura();
    atualizarTela();

    if (!jogadorUm.continuaVivo()) {
        finalizarJogo(jogadorDois.nome);
        jogandoTurno = false;
        return;
    }

    turno = turno + 1;
    jogandoTurno = false;
    botaoProximo.disabled = false;
    atualizarTela();
}

function finalizarJogo(vencedor: string): void {
    // Libera os botões para permitir uma nova partida após a vitória.
    atualizarTela();

    escreverLog("================ FIM DE JOGO ================");
    escreverLog(vencedor + " ganhou a luta!");

    botaoProximo.disabled = true;
    botaoStart.disabled = false;
    seletorJogadorUm.disabled = false;
    seletorJogadorDois.disabled = false;
    jogoComecou = false;
}

function reiniciarJogo(): void {
    // Volta o jogo para o estado de escolha de personagens.
    jogoComecou = false;
    jogandoTurno = false;
    turno = 1;

    prepararPersonagensPelosSeletores();

    botaoStart.disabled = false;
    botaoProximo.disabled = true;
    seletorJogadorUm.disabled = false;
    seletorJogadorDois.disabled = false;

    const log = document.getElementById("log") as HTMLDivElement;
    log.innerHTML = "Escolha os personagens e clique em START para começar a batalha.";

    removerClassesDeAnimacao();
    atualizarTela();
}

function atualizarTela(idImagemIgnorada: string = ""): void {
    // Atualiza os dois cards da arena com vida, barra, imagem e efeitos visuais.
    if (!jogadorUm || !jogadorDois) {
        return;
    }

    atualizarCardPersonagem(
        jogadorUm,
        "nome-jogador-um",
        "hp-jogador-um",
        "barra-jogador-um",
        "imgjoggadorUm",
        "card-jogador-um",
        idImagemIgnorada
    );

    atualizarCardPersonagem(
        jogadorDois,
        "nome-jogador-dois",
        "hp-jogador-dois",
        "barra-jogador-dois",
        "imgjoggadorDois",
        "card-jogador-dois",
        idImagemIgnorada
    );
}

function atualizarCardPersonagem(
    personagem: Personagem,
    idNome: string,
    idHp: string,
    idBarra: string,
    idImagem: string,
    idCard: string,
    idImagemIgnorada: string
): void {
    // Centraliza a atualização visual de um personagem para evitar repetição de código.
    const nome = document.getElementById(idNome) as HTMLElement;
    const hp = document.getElementById(idHp) as HTMLElement;

    nome.textContent = personagem.nome;
    hp.textContent = "HP: " + personagem.getVida() + " / " + personagem.getVidaMaxima();

    atualizarBarraDeVida(idBarra, personagem);

    if (idImagem !== idImagemIgnorada) {
        atualizarImagemPersonagem(idImagem, idCard, personagem);
    } else {
        atualizarCardVidaBaixa(idCard, personagem);
    }
}

function atualizarBarraDeVida(idBarra: string, personagem: Personagem): void {
    // A cor da barra muda conforme a porcentagem de vida restante.
    const barra = document.getElementById(idBarra) as HTMLDivElement;
    const porcentagem = personagem.getPorcentagemVida();

    barra.style.width = porcentagem + "%";
    barra.classList.remove("vida-amarela", "vida-vermelha");

    if (porcentagem <= 35) {
        barra.classList.add("vida-vermelha");
    } else if (porcentagem <= 60) {
        barra.classList.add("vida-amarela");
    }
}

function atualizarImagemPersonagem(idImagem: string, idCard: string, personagem: Personagem): void {
    // Troca a imagem normal pela imagem de pouca vida quando necessário.
    const imagem = document.getElementById(idImagem) as HTMLImageElement;
    const novaImagem = personagem.getImg();

    if (imagem.getAttribute("src") !== novaImagem) {
        imagem.setAttribute("src", novaImagem);
    }

    imagem.setAttribute("alt", personagem.nome);
    atualizarCardVidaBaixa(idCard, personagem);
}

function atualizarCardVidaBaixa(idCard: string, personagem: Personagem): void {
    // A classe vida-baixa permite destacar o card pelo CSS.
    const card = document.getElementById(idCard) as HTMLDivElement;

    if (personagem.estaComPoucaVida()) {
        card.classList.add("vida-baixa");
    } else {
        card.classList.remove("vida-baixa");
    }
}

async function executarAnimacaoAtaque(
    idImagemAtacante: string,
    idImagemDefensor: string,
    classeAtaque: string,
    imagemAtaque: string,
    personagemAtacante: Personagem,
    acaoAtaque: () => void
): Promise<void> {
    // Controla a sequência visual: prepara animação, aplica dano e restaura a imagem.
    const imagemAtacante = document.getElementById(idImagemAtacante) as HTMLImageElement;
    const imagemDefensor = document.getElementById(idImagemDefensor) as HTMLImageElement;

    imagemAtacante.classList.remove(classeAtaque);
    imagemDefensor.classList.remove("recebendo-dano");

    // Força o navegador a reiniciar a animação mesmo quando a mesma classe é usada de novo.
    void imagemAtacante.offsetWidth;

    if (imagemAtaque.trim() !== "") {
        imagemAtacante.setAttribute("src", imagemAtaque);
    }

    imagemAtacante.classList.add(classeAtaque);

    await esperar(520);

    acaoAtaque();
    imagemDefensor.classList.add("recebendo-dano");
    atualizarTela(idImagemAtacante);

    await esperar(520);

    imagemAtacante.classList.remove(classeAtaque);
    imagemDefensor.classList.remove("recebendo-dano");
    imagemAtacante.setAttribute("src", personagemAtacante.getImg());
    atualizarTela();
}

function removerClassesDeAnimacao(): void {
    // Limpa efeitos visuais para o reinício começar sem animações antigas presas na tela.
    const imgJogadorUm = document.getElementById("imgjoggadorUm") as HTMLImageElement;
    const imgJogadorDois = document.getElementById("imgjoggadorDois") as HTMLImageElement;

    imgJogadorUm.classList.remove("atacando-direita", "atacando-esquerda", "recebendo-dano");
    imgJogadorDois.classList.remove("atacando-direita", "atacando-esquerda", "recebendo-dano");
}

function esperar(tempo: number): Promise<void> {
    // Pequena pausa usada para sincronizar as animações com a lógica do turno.
    return new Promise(function (resolve): void {
        setTimeout(resolve, tempo);
    });
}

function escreverLog(texto: string): void {
    // Mostra a mensagem no console visual da página e também no console do navegador.
    const log = document.getElementById("log") as HTMLDivElement;

    log.innerHTML += "<div class='linha-log'>" + texto + "</div>";
    log.scrollTop = log.scrollHeight;

    console.log(texto);
}

(window as any).escreverLog = escreverLog;

reiniciarJogo();
