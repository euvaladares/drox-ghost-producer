# DROX — Ghost Production & Produção Musical

Landing page de captação de leads para o serviço de ghost production, produção musical, mix e master do DROX (Brasília). Site estático feito com **Vite**, HTML, CSS e JavaScript puros.

## Como funciona o funil

1. Todos os botões "FALAR COMIGO" (`data-open-form`) abrem um formulário em etapas.
2. O lead responde: nome (e nome artístico opcional), serviço, fase do projeto, urgência e quanto pode investir.
3. A última tela mostra um resumo. Ao clicar em **Enviar**, o evento `Lead` é disparado no Meta Pixel e o lead é levado ao WhatsApp com a mensagem pronta.

O formulário fica no final do `index.html` (`#lead-form`) e a lógica em `src/main.js`.

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

## Onde alterar o que muda com frequência

| O quê | Onde |
| --- | --- |
| Número do WhatsApp | `WHATSAPP_NUMBER` em `src/main.js` |
| Texto da mensagem enviada | função `buildMessage()` em `src/main.js` |
| Opções de serviço e fase do projeto | objeto `OPTIONS` em `src/main.js` |
| Perguntas de urgência e orçamento | seções `data-step` no `index.html` |
| ID do Meta Pixel | `index.html` (script no `<head>` e `<noscript>`) |
| Cores e fontes | variáveis em `:root` no início de `src/style.css` |

## Integrações

- **Meta Pixel** (`PageView` ao carregar, `Lead` ao clicar em Enviar). O pixel e a conta de anúncios devem pertencer ao dono do site.
- **Vercel Analytics** (`inject()` em `src/main.js`). Só registra dados se o site estiver hospedado na Vercel; em outra hospedagem, remova a linha e a dependência `@vercel/analytics`.

## Deploy

O build gera arquivos estáticos em `dist/` e pode ser publicado em qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, etc.).

## Imagens

As fotos em `src/assets/` já estão otimizadas (1200×1800, JPEG). Ao trocar uma foto, redimensione antes de adicionar para manter a página leve.
