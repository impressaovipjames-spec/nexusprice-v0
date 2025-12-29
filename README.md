# NEXUSPRICE V0
Sistema de Busca de Menor Preço Total

## Status
✓ Build: SUCCESS  
✓ Validação Local: APROVADA  
✓ Testes: 4/4 PASSARAM  

## Deploy Rápido

### Opção 1: Vercel (Recomendado - 2 minutos)
1. Acesse: https://vercel.com/new
2. Importe este repositório OU faça upload da pasta `dist/`
3. Deploy automático

### Opção 2: Netlify Drop (Mais Rápido - 30 segundos)
1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `dist/` para o navegador
3. URL pública gerada instantaneamente

### Opção 3: GitHub Pages
```bash
git init
git add .
git commit -m "V0 NEXUSPRICE"
git branch -M main
git remote add origin [SEU_REPO]
git push -u origin main
```
Depois ative GitHub Pages apontando para `/dist`

## Estrutura
```
NEXUSPRICE/
├── dist/           ← Build de produção (PRONTO)
├── src/            ← Código fonte
├── package.json    ← Dependências
└── vite.config.js  ← Configuração
```

## Comandos
```bash
npm install         # Instalar dependências
npm run dev         # Servidor local (http://localhost:5173)
npm run build       # Build de produção
```

## Tecnologias
- React 18
- Vite 4
- Vanilla CSS
- Mock Service (substituir por API real em produção)

## Próximos Passos (Pós-Deploy)
1. Substituir Mock Service por API real (Google Shopping, etc)
2. Adicionar analytics básico
3. Configurar domínio customizado

---
**ORION 3.0** | **ANTIGRAVITY EXECUTION** | **V0 VALIDATED**
