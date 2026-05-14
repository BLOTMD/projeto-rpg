# Jogo RPG

Jogo de batalha por turnos feito com TypeScript, HTML e CSS. Dois jogadores escolhem personagens, iniciam a luta e avancam turno por turno ate que um deles fique sem vida.

## Como rodar

1. Instale as dependencias com `npm install`.
2. Gere o JavaScript do navegador com `npm run build`.
3. Abra o arquivo `display.html` no navegador.

O arquivo `rungame.js` e gerado a partir de `main.ts`. Sempre que alterar arquivos `.ts`, rode o build de novo.

## Estrutura da pasta

- `display.html`: tela do jogo, seletores dos jogadores, cards, botoes e area de log.
- `style.css`: estilos da arena, cards, barra de vida, botoes, console e animacoes.
- `main.ts`: controla selecao de personagens, inicio da partida, turnos, curas, fim de jogo, imagens e atualizacao da tela.
- `personagem.ts`: classe base com vida, forca, defesa, cura, dano recebido, imagem de pouca vida e regra de cura.
- `Personagens/`: classes especificas de cada personagem e seus ataques.
- `imagens/`: imagens locais usadas nos estados normal, pouca vida e ataque.
- `rungame.js`: arquivo final gerado pelo build para o navegador executar.
- `package.json`: scripts e dependencias do projeto.

## Personagens e atributos

| Personagem | Forca | Vida | Defesa | Cura | Papel no jogo |
| --- | ---: | ---: | ---: | ---: | --- |
| Cavaleiro | 75 | 360 | 60 | 70 | Tanque resistente, com dano estavel. |
| Mago | 95 | 190 | 15 | 150 | Alto dano e cura forte, mas fragil. |
| Assassino | 70 | 230 | 25 | 80 | Agil, com chance de golpes criticos. |
| Banguela | 105 | 240 | 35 | 60 | Atacante pesado com golpes elementais fortes. |
| Arqueiro | 65 | 220 | 20 | 100 | Lutador de alcance com dano moderado e boa recuperacao. |

## Regras principais

- Cada jogador escolhe um personagem antes de iniciar a batalha.
- Depois do inicio, os seletores ficam bloqueados ate o fim ou reinicio.
- Em cada turno, o jogador 1 ataca primeiro e o jogador 2 contra-ataca se sobreviver.
- A defesa reduz o dano recebido, mas todo ataque causa pelo menos 1 de dano.
- Cada personagem pode usar cura uma unica vez quando fica com 50 de vida ou menos.
- Quando a vida cai para 35% ou menos, o card recebe destaque visual e a imagem muda para o estado de pouca vida.
- O vencedor e o personagem que deixa o oponente com 0 de vida.

## Fluxo dos arquivos

1. `display.html` carrega a interface e importa `rungame.js`.
2. `rungame.js`, gerado de `main.ts`, cria os personagens conforme os seletores.
3. As classes em `Personagens/` aplicam os ataques usando a classe base `Personagem`.
4. `personagem.ts` calcula dano, vida restante, cura e imagem atual.
5. `main.ts` atualiza o HTML, a barra de vida, as imagens, animacoes e mensagens do log.

## Onde alterar

- Para mudar atributos iniciais, edite a funcao `criarPersonagem` em `main.ts`.
- Para mudar ataques, edite a classe do personagem dentro de `Personagens/`.
- Para trocar imagens, edite o mapa `IMAGENS_PERSONAGENS` em `main.ts`.
- Para ajustar visual e animacoes, edite `style.css`.
