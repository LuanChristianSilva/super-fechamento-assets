# TV Videos - Player para TV Corporativa

Página estática para exibição de vídeo em tela cheia em TVs corporativas (Samsung, LG, Android TV e navegadores em geral), publicada via GitHub Pages.

## Estrutura do projeto

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Como funciona

- O vídeo é carregado diretamente do Cloudinary via tag `<video>`.
- Ocupa 100% da viewport (`100vw` x `100vh`), sem barras, margens ou scroll.
- Inicia automaticamente (`autoplay`), sem áudio (`muted`) e sem controles visíveis.
- Permanece em loop infinito, com reforço via JavaScript para navegadores que ignoram o atributo `loop`.
- Se o vídeo pausar, travar ou falhar ao carregar, o script tenta retomar ou recarregar automaticamente.

## Publicando no GitHub Pages

1. Crie um repositório no GitHub (ex.: `TV_Videos_git`) e envie todos os arquivos deste projeto para ele:
   ```bash
   git init
   git add .
   git commit -m "Página de vídeo para TV corporativa"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/<seu-repositorio>.git
   git push -u origin main
   ```

2. No GitHub, acesse **Settings > Pages** do repositório.

3. Em **Build and deployment**, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main` / pasta `/ (root)`

4. Salve. Após alguns instantes, o GitHub fornecerá uma URL pública, algo como:
   ```
   https://<seu-usuario>.github.io/<seu-repositorio>/
   ```

5. Abra essa URL no navegador da Smart TV e configure-a como página inicial/kiosk do navegador da TV, se disponível.

## Trocando o vídeo

Para usar outro vídeo, edite o atributo `src` da tag `<video>` em `index.html`, apontando para a nova URL hospedada (Cloudinary ou outro CDN).

## Observações para Smart TVs

- Alguns navegadores de Smart TV bloqueiam `autoplay` com áudio; por isso o vídeo é sempre carregado com `muted`.
- O atributo `playsinline` evita que o vídeo abra em um player de tela cheia nativo separado.
- O script em `js/script.js` monitora continuamente o estado do vídeo (pausa, erro, buffer travado) e tenta recuperá-lo automaticamente, mantendo a exibição contínua 24/7.
- O script tenta ativar a Fullscreen API automaticamente ao carregar a página, com nova tentativa na primeira interação (toque/clique/tecla), caso o navegador exija um gesto do usuário.

## Sobre o corte do vídeo (object-fit: cover)

O vídeo padrão (`Arraia_Navarro-compressed_gfmjhe.mp4`) tem resolução **3840x2160**, ou seja, proporção **16:9** — igual à maioria das TVs. Com `object-fit: cover` num viewport realmente 16:9 e em fullscreen, o vídeo preenche a tela **sem cortar nada**.

Se durante o teste em um navegador de computador o vídeo aparecer cortado em cima/embaixo, isso normalmente **não é um bug do código**: é porque a janela do navegador não está em fullscreen real. A barra de endereço/abas reduz a altura útil da página, deixando a proporção do viewport mais larga que 16:9, e o `cover` corta o excesso vertical para preencher a largura.

Para validar corretamente antes de ir para a TV:
- No PC, aperte **F11** (fullscreen real) antes de avaliar o enquadramento.
- Na TV, garanta que o navegador/app está rodando em modo fullscreen/kiosk (a maioria já roda assim por padrão).

Se trocar o vídeo por um com proporção diferente de 16:9, o corte lateral ou vertical (dependendo do caso) é inevitável mantendo `object-fit: cover` sem barras — é uma troca inerente entre "preencher a tela sem barras" e "mostrar o quadro completo sem cortes". Não há como ter as duas coisas ao mesmo tempo a menos que a proporção do vídeo seja idêntica à da tela.
