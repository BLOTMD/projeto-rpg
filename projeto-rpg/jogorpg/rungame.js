(() => {
  // personagem.ts
  var Personagem = class {
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
      return this.vida / this.vidaMaxima * 100;
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
      return Math.floor(Math.random() * 3) + 1;
    }
  };

  // Personagens/wizard.ts
  var Wizard = class extends Personagem {
    // Mago: alto dano e cura forte, mas pouca vida e baixa defesa.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida) {
      super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }
    atacar(persona) {
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
  };

  // Personagens/knight.ts
  var Knight = class extends Personagem {
    // Cavaleiro: tanque da arena, com muita vida, alta defesa e dano mais estavel.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida) {
      super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }
    atacar(persona) {
      escreverLog(this.nome + " ataca com a espada.");
      persona.sofrerDano(this.forca);
    }
  };

  // Personagens/assassino.ts
  var Assassino = class extends Personagem {
    // Assassino: personagem agil, com vida media e chance de golpe critico.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida) {
      super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }
    atacar(persona) {
      const golpe = this.gerarAtaque();
      if (golpe === 1) {
        escreverLog(this.nome + " ataca com a adaga.");
        persona.sofrerDano(this.forca);
      } else if (golpe === 2) {
        escreverLog(this.nome + " faz um corte r\xE1pido.");
        persona.sofrerDano(this.forca + 15);
      } else {
        escreverLog(this.nome + " acerta um golpe critico pelas sombras.");
        persona.sofrerDano(this.forca + 30);
      }
    }
  };

  // Personagens/banguela.ts
  var Banguela = class extends Personagem {
    // Banguela: atacante pesado, com bons golpes elementais e cura menor.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida) {
      super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }
    atacar(persona) {
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
  };

  // Personagens/arqueiro.ts
  var Arqueiro = class extends Personagem {
    // Arqueiro: lutador de alcance, com dano moderado e boa cura de seguranca.
    constructor(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida) {
      super(nome, forca, vida, defesa, cura, imagemNormal, imagemPoucaVida);
    }
    atacar(persona) {
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
  };

  // main.ts
  var IMAGENS_PERSONAGENS = {
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
    },
    banguela: {
      normal: "imagens/banguela.normal.png",
      poucaVida: "imagens/banguela.lowHp.jpg",
      ataque: "imagens/banguela.ataque.png"
    },
    arqueiro: {
      normal: "imagens/arqueiro.normal.png",
      poucaVida: "imagens/arqueiro.lowHp.png",
      ataque: "imagens/arqueiro.ataque.webp"
    }
  };
  var jogadorUm;
  var jogadorDois;
  var tipoJogadorUm = "cavaleiro";
  var tipoJogadorDois = "mago";
  var turno = 1;
  var jogoComecou = false;
  var jogandoTurno = false;
  var botaoStart = document.getElementById("botaojogar");
  var botaoProximo = document.getElementById("proximo");
  var botaoReiniciar = document.getElementById("reiniciar");
  var seletorJogadorUm = document.getElementById("Trocar1");
  var seletorJogadorDois = document.getElementById("Trocar2");
  botaoStart.addEventListener("click", iniciarJogo);
  botaoProximo.addEventListener("click", jogarTurno);
  botaoReiniciar.addEventListener("click", reiniciarJogo);
  seletorJogadorUm.addEventListener("change", trocarPersonagensAntesDaLuta);
  seletorJogadorDois.addEventListener("change", trocarPersonagensAntesDaLuta);
  function criarPersonagem(tipo) {
    if (tipo === "cavaleiro") {
      return new Knight(
        "Cavaleiro",
        75,
        360,
        60,
        70,
        IMAGENS_PERSONAGENS.cavaleiro.normal,
        IMAGENS_PERSONAGENS.cavaleiro.poucaVida
      );
    }
    if (tipo === "mago") {
      return new Wizard(
        "Mago",
        95,
        190,
        15,
        150,
        IMAGENS_PERSONAGENS.mago.normal,
        IMAGENS_PERSONAGENS.mago.poucaVida
      );
    }
    if (tipo === "assassino") {
      return new Assassino(
        "Assassino",
        70,
        230,
        25,
        80,
        IMAGENS_PERSONAGENS.assassino.normal,
        IMAGENS_PERSONAGENS.assassino.poucaVida
      );
    }
    if (tipo === "banguela") {
      return new Banguela(
        "Banguela",
        105,
        240,
        35,
        60,
        IMAGENS_PERSONAGENS.banguela.normal,
        IMAGENS_PERSONAGENS.banguela.poucaVida
      );
    }
    if (tipo === "arqueiro") {
      return new Arqueiro(
        "Arqueiro",
        65,
        220,
        20,
        100,
        IMAGENS_PERSONAGENS.arqueiro.normal,
        IMAGENS_PERSONAGENS.arqueiro.poucaVida
      );
    }
    throw new Error("Tipo de personagem invalido: " + tipo);
  }
  function getTipoSelecionado(seletor) {
    const valor = seletor.value;
    if (valor === "mago" || valor === "assassino" || valor === "cavaleiro" || valor === "banguela" || valor === "arqueiro") {
      return valor;
    }
    return "cavaleiro";
  }
  function prepararPersonagensPelosSeletores() {
    tipoJogadorUm = getTipoSelecionado(seletorJogadorUm);
    tipoJogadorDois = getTipoSelecionado(seletorJogadorDois);
    jogadorUm = criarPersonagem(tipoJogadorUm);
    jogadorDois = criarPersonagem(tipoJogadorDois);
  }
  function trocarPersonagensAntesDaLuta() {
    if (jogoComecou || jogandoTurno) {
      return;
    }
    prepararPersonagensPelosSeletores();
    atualizarTela();
  }
  function iniciarJogo() {
    prepararPersonagensPelosSeletores();
    turno = 1;
    jogoComecou = true;
    jogandoTurno = false;
    const log = document.getElementById("log");
    log.innerHTML = "";
    escreverLog2("A batalha comecou!");
    escreverLog2("Jogador 1 escolheu: " + jogadorUm.nome + ".");
    escreverLog2("Jogador 2 escolheu: " + jogadorDois.nome + ".");
    escreverLog2("Clique em PROXIMO TURNO para continuar.");
    botaoStart.disabled = true;
    botaoProximo.disabled = false;
    seletorJogadorUm.disabled = true;
    seletorJogadorDois.disabled = true;
    atualizarTela();
  }
  async function jogarTurno() {
    if (!jogoComecou || jogandoTurno) {
      return;
    }
    jogandoTurno = true;
    botaoProximo.disabled = true;
    escreverLog2("---------------- Turno " + turno + " ----------------");
    await executarAnimacaoAtaque(
      "imgjoggadorUm",
      "imgjoggadorDois",
      "atacando-direita",
      IMAGENS_PERSONAGENS[tipoJogadorUm].ataque,
      jogadorUm,
      function() {
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
    await executarAnimacaoAtaque(
      "imgjoggadorDois",
      "imgjoggadorUm",
      "atacando-esquerda",
      IMAGENS_PERSONAGENS[tipoJogadorDois].ataque,
      jogadorDois,
      function() {
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
    atualizarTela();
    escreverLog2("================ FIM DE JOGO ================");
    escreverLog2(vencedor + " ganhou a luta!");
    botaoProximo.disabled = true;
    botaoStart.disabled = false;
    seletorJogadorUm.disabled = false;
    seletorJogadorDois.disabled = false;
    jogoComecou = false;
  }
  function reiniciarJogo() {
    jogoComecou = false;
    jogandoTurno = false;
    turno = 1;
    prepararPersonagensPelosSeletores();
    botaoStart.disabled = false;
    botaoProximo.disabled = true;
    seletorJogadorUm.disabled = false;
    seletorJogadorDois.disabled = false;
    const log = document.getElementById("log");
    log.innerHTML = "Escolha os personagens e clique em START para comecar a batalha.";
    removerClassesDeAnimacao();
    atualizarTela();
  }
  function atualizarTela(idImagemIgnorada = "") {
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
    const imagem = document.getElementById(idImagem);
    const novaImagem = personagem.getImg();
    if (imagem.getAttribute("src") !== novaImagem) {
      imagem.setAttribute("src", novaImagem);
    }
    imagem.setAttribute("alt", personagem.nome);
    atualizarCardVidaBaixa(idCard, personagem);
  }
  function atualizarCardVidaBaixa(idCard, personagem) {
    const card = document.getElementById(idCard);
    if (personagem.estaComPoucaVida()) {
      card.classList.add("vida-baixa");
    } else {
      card.classList.remove("vida-baixa");
    }
  }
  async function executarAnimacaoAtaque(idImagemAtacante, idImagemDefensor, classeAtaque, imagemAtaque, personagemAtacante, acaoAtaque) {
    const imagemAtacante = document.getElementById(idImagemAtacante);
    const imagemDefensor = document.getElementById(idImagemDefensor);
    imagemAtacante.classList.remove(classeAtaque);
    imagemDefensor.classList.remove("recebendo-dano");
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
    const imgJogadorUm = document.getElementById("imgjoggadorUm");
    const imgJogadorDois = document.getElementById("imgjoggadorDois");
    imgJogadorUm.classList.remove("atacando-direita", "atacando-esquerda", "recebendo-dano");
    imgJogadorDois.classList.remove("atacando-direita", "atacando-esquerda", "recebendo-dano");
  }
  function esperar(tempo) {
    return new Promise(function(resolve) {
      setTimeout(resolve, tempo);
    });
  }
  function escreverLog2(texto) {
    const log = document.getElementById("log");
    log.innerHTML += "<div class='linha-log'>" + texto + "</div>";
    log.scrollTop = log.scrollHeight;
    console.log(texto);
  }
  window.escreverLog = escreverLog2;
  reiniciarJogo();
})();
