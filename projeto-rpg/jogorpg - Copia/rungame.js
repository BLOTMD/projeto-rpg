class Personagem {
    // Classe base com os atributos e regras compartilhadas por todos os lutadores.
    nome;
    forca;
    vida;
    vidaMaxima;
    defesa;
    cura;
    jaUsouCura = false;
    imagemNormal = "";
    imagemPoucaVida = "";

    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida = "") {
        this.nome = nome;
        this.forca = forca;
        this.vida = vida;
        this.vidaMaxima = vida;
        this.defesa = defesa;
        this.cura = cura;
        this.imagemNormal = imagemNormal;
        this.imagemPoucaVida = imagemPoucaVida;
    }

    continuaVivo() {
        return this.vida > 0;
    }

    getVida() {
        return this.vida;
    }

    getVidaMaxima() {
        return this.vidaMaxima;
    }

    getPorcentagemVida() {
        return (this.vida / this.vidaMaxima) * 100;
    }

    estaComPoucaVida() {
        return this.getPorcentagemVida() <= 35 && this.continuaVivo();
    }

    getImg() {
        if (this.estaComPoucaVida() && this.imagemPoucaVida.trim() !== "") {
            return this.imagemPoucaVida;
        }

        return this.imagemNormal;
    }

    sofrerDano(dano) {
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

    usarCura() {
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

    gerarAtaque() {
        // Sorteia uma variacao de ataque para personagens com golpes diferentes.
        return Math.floor(Math.random() * 3) + 1;
    }
}

class Knight extends Personagem {
    // Cavaleiro: personagem mais resistente, com ataque direto de espada.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida = "") {
        super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }

    atacar(persona) {
        // O cavaleiro usa sempre o mesmo golpe, baseado apenas na forca.
        escreverLog(this.nome + " ataca com a espada.");
        persona.sofrerDano(this.forca);
    }
}

class Wizard extends Personagem {
    // Mago: causa bastante dano, mas tem menos vida e defesa.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida = "") {
        super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }

    atacar(persona) {
        // O ataque do mago e sorteado entre fogo, terra e gelo.
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

class Assassino extends Personagem {
    // Assassino: personagem equilibrado, com chance de causar golpes mais fortes.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida = "") {
        super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }

    atacar(persona) {
        // Sorteia entre ataque simples, ataque rapido e golpe critico.
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

const IMAGENS_PERSONAGENS = {
    // Mapa usado para trocar as imagens conforme o personagem e o estado da batalha.
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

let jogadorUm;
let jogadorDois;
let tipoJogadorUm = "cavaleiro";
let tipoJogadorDois = "mago";
let turno = 1;
let jogoComecou = false;
let jogandoTurno = false;

// Elementos principais da tela que controlam a escolha dos personagens e os turnos.
const botaoStart = document.getElementById("botaojogar");
const botaoProximo = document.getElementById("proximo");
const botaoReiniciar = document.getElementById("reiniciar");
const seletorJogadorUm = document.getElementById("Trocar1");
const seletorJogadorDois = document.getElementById("Trocar2");

botaoStart.addEventListener("click", iniciarJogo);
botaoProximo.addEventListener("click", jogarTurno);
botaoReiniciar.addEventListener("click", reiniciarJogo);
seletorJogadorUm.addEventListener("change", trocarPersonagensAntesDaLuta);
seletorJogadorDois.addEventListener("change", trocarPersonagensAntesDaLuta);

function criarPersonagem(tipo) {
    // Cria uma nova instancia sempre que o jogo comeca ou e reiniciado.
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

function getTipoSelecionado(seletor) {
    // Garante que apenas tipos validos sejam usados para criar personagens.
    const valor = seletor.value;

    if (valor === "mago" || valor === "assassino" || valor === "cavaleiro") {
        return valor;
    }

    return "cavaleiro";
}

function prepararPersonagensPelosSeletores() {
    // Le os seletores da tela e monta os dois jogadores da luta.
    tipoJogadorUm = getTipoSelecionado(seletorJogadorUm);
    tipoJogadorDois = getTipoSelecionado(seletorJogadorDois);

    jogadorUm = criarPersonagem(tipoJogadorUm);
    jogadorDois = criarPersonagem(tipoJogadorDois);
}

function trocarPersonagensAntesDaLuta() {
    // A troca so e permitida antes da batalha comecar.
    if (jogoComecou || jogandoTurno) {
        return;
    }

    prepararPersonagensPelosSeletores();
    atualizarTela();
}

function iniciarJogo() {
    // Prepara o estado inicial da partida e bloqueia as escolhas durante a batalha.
    prepararPersonagensPelosSeletores();
    turno = 1;
    jogoComecou = true;
    jogandoTurno = false;

    const log = document.getElementById("log");
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

async function jogarTurno() {
    // Evita cliques repetidos enquanto as animacoes e ataques do turno estao acontecendo.
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
        function () {
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
        function () {
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

function finalizarJogo(vencedor) {
    // Libera os botoes para permitir uma nova partida apos a vitoria.
    atualizarTela();

    escreverLog("================ FIM DE JOGO ================");
    escreverLog(vencedor + " ganhou a luta!");

    botaoProximo.disabled = true;
    botaoStart.disabled = false;
    seletorJogadorUm.disabled = false;
    seletorJogadorDois.disabled = false;
    jogoComecou = false;
}

function reiniciarJogo() {
    // Volta o jogo para o estado de escolha de personagens.
    jogoComecou = false;
    jogandoTurno = false;
    turno = 1;

    prepararPersonagensPelosSeletores();

    botaoStart.disabled = false;
    botaoProximo.disabled = true;
    seletorJogadorUm.disabled = false;
    seletorJogadorDois.disabled = false;

    const log = document.getElementById("log");
    log.innerHTML = "Escolha os personagens e clique em START para começar a batalha.";

    removerClassesDeAnimacao();
    atualizarTela();
}

function atualizarTela(idImagemIgnorada = "") {
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

function atualizarCardPersonagem(personagem, idNome, idHp, idBarra, idImagem, idCard, idImagemIgnorada) {
    // Centraliza a atualizacao visual de um personagem para evitar repeticao de codigo.
    const nome = document.getElementById(idNome);
    const hp = document.getElementById(idHp);

    nome.textContent = personagem.nome;
    hp.textContent = "HP: " + personagem.getVida() + " / " + personagem.getVidaMaxima();

    atualizarBarraDeVida(idBarra, personagem);

    if (idImagem !== idImagemIgnorada) {
        atualizarImagemPersonagem(idImagem, idCard, personagem);
    } else {
        atualizarCardVidaBaixa(idCard, personagem);
    }
}

function atualizarBarraDeVida(idBarra, personagem) {
    // A cor da barra muda conforme a porcentagem de vida restante.
    const barra = document.getElementById(idBarra);
    const porcentagem = personagem.getPorcentagemVida();

    barra.style.width = porcentagem + "%";
    barra.classList.remove("vida-amarela", "vida-vermelha");

    if (porcentagem <= 35) {
        barra.classList.add("vida-vermelha");
    } else if (porcentagem <= 60) {
        barra.classList.add("vida-amarela");
    }
}

function atualizarImagemPersonagem(idImagem, idCard, personagem) {
    // Troca a imagem normal pela imagem de pouca vida quando necessario.
    const imagem = document.getElementById(idImagem);
    const novaImagem = personagem.getImg();

    if (imagem.getAttribute("src") !== novaImagem) {
        imagem.setAttribute("src", novaImagem);
    }

    imagem.setAttribute("alt", personagem.nome);
    atualizarCardVidaBaixa(idCard, personagem);
}

function atualizarCardVidaBaixa(idCard, personagem) {
    // A classe vida-baixa permite destacar o card pelo CSS.
    const card = document.getElementById(idCard);

    if (personagem.estaComPoucaVida()) {
        card.classList.add("vida-baixa");
    } else {
        card.classList.remove("vida-baixa");
    }
}

async function executarAnimacaoAtaque(idImagemAtacante, idImagemDefensor, classeAtaque, imagemAtaque, personagemAtacante, acaoAtaque) {
    // Controla a sequencia visual: prepara animacao, aplica dano e restaura a imagem.
    const imagemAtacante = document.getElementById(idImagemAtacante);
    const imagemDefensor = document.getElementById(idImagemDefensor);

    imagemAtacante.classList.remove(classeAtaque);
    imagemDefensor.classList.remove("recebendo-dano");

    // Forca o navegador a reiniciar a animacao mesmo quando a mesma classe e usada de novo.
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

function removerClassesDeAnimacao() {
    // Limpa efeitos visuais para o reinicio comecar sem animacoes antigas presas na tela.
    const imgJogadorUm = document.getElementById("imgjoggadorUm");
    const imgJogadorDois = document.getElementById("imgjoggadorDois");

    imgJogadorUm.classList.remove("atacando-direita", "atacando-esquerda", "recebendo-dano");
    imgJogadorDois.classList.remove("atacando-direita", "atacando-esquerda", "recebendo-dano");
}

function esperar(tempo) {
    // Pequena pausa usada para sincronizar as animacoes com a logica do turno.
    return new Promise(function (resolve) {
        setTimeout(resolve, tempo);
    });
}

function escreverLog(texto) {
    // Mostra a mensagem no console visual da pagina e tambem no console do navegador.
    const log = document.getElementById("log");

    log.innerHTML += "<div class='linha-log'>" + texto + "</div>";
    log.scrollTop = log.scrollHeight;

    console.log(texto);
}

window.escreverLog = escreverLog;

reiniciarJogo();
