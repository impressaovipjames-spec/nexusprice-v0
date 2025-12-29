# NEXUSPRICE V0 - DEPLOYMENT GUIDE

## Deploy via Vercel (Recomendado)

### Opção 1: Deploy via CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Opção 2: Deploy via GitHub
1. Push o código para GitHub
2. Acesse vercel.com
3. Import repository
4. Deploy automático

## Deploy via Netlify

### Via CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Via Drag & Drop
1. Acesse app.netlify.com/drop
2. Arraste a pasta `dist/`
3. Deploy instantâneo

## Deploy via Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Estrutura de Build
- Build folder: `dist/`
- Build command: `npm run build`
- Dev command: `npm run dev`
- Framework: Vite + React

## Variáveis de Ambiente
Nenhuma variável necessária para V0.

## Status
✓ Build validado
✓ Testes passaram
✓ Pronto para deploy
