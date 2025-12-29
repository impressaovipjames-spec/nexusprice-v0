# NEXUSPRICE V1 — DOCUMENTAÇÃO TÉCNICA

## NOVAS FUNCIONALIDADES

### 1. FAVORITOS
**Descrição**: Permite ao usuário salvar ofertas para consulta posterior.

**Funcionalidades**:
- Botão "SALVAR" no card de resultado
- Indicador visual quando já está salvo (coração preenchido)
- Lista de favoritos acessível via tab
- Remover favoritos individualmente
- Persistência local (não requer login)

**Fluxo**:
1. Usuário busca produto
2. Resultado aparece com botão "SALVAR"
3. Clica em "SALVAR"
4. Oferta é adicionada aos Favoritos
5. Botão muda para "SALVO" (desabilitado)
6. Acessa tab "FAVORITOS" para ver lista completa

**Regras**:
- Não permite duplicatas (mesma loja + produto)
- Sem limite de favoritos
- Timestamp de quando foi salvo

---

### 2. HISTÓRICO SIMPLES
**Descrição**: Registra as últimas buscas realizadas pelo usuário.

**Funcionalidades**:
- Salva automaticamente cada busca bem-sucedida
- Mostra query + resultado (loja e preço)
- Máximo de 10 itens (FIFO - First In, First Out)
- Clicar em item do histórico restaura a busca
- Persistência local

**Fluxo**:
1. Usuário faz busca
2. Sistema salva automaticamente no histórico
3. Acessa tab "HISTÓRICO"
4. Vê lista das últimas 10 buscas
5. Clica em uma busca antiga
6. Volta para tab "BUSCAR" com resultado restaurado

**Regras**:
- Limite fixo: 10 itens
- Ordem: mais recente primeiro
- Salva apenas buscas com sucesso

---

## COMO OS DADOS SÃO SALVOS

### Tecnologia: localStorage (Browser)
**Vantagens**:
- Zero custo
- Zero latência
- Zero configuração
- Funciona offline
- Sem necessidade de backend

**Estrutura de Dados**:

```javascript
// FAVORITOS
localStorage.setItem('nexusprice_favorites', JSON.stringify([
  {
    loja: 'Amazon',
    produto: 'iPhone 15 128GB',
    preco_base: 4899,
    custo_frete: 0,
    preco_total: 4899,
    prazo_dias: 2,
    reputacao: 'Alta',
    link: '#',
    savedAt: '2025-12-29T19:20:00.000Z'
  }
]))

// HISTÓRICO
localStorage.setItem('nexusprice_history', JSON.stringify([
  {
    query: 'iPhone 15 128gb',
    result: { /* oferta completa */ },
    searchedAt: '2025-12-29T19:20:00.000Z'
  }
]))
```

**Limitações**:
- Dados são por navegador/dispositivo
- Limpar cache = perder dados
- ~5-10MB de limite (suficiente para V1)

---

## EXEMPLO DE FLUXO COM FAVORITO

### Cenário: Usuário busca iPhone e salva como favorito

**Passo 1**: Busca inicial
```
Input: "iPhone 15 128gb"
Sistema: Executa busca → Retorna Fast Shop (R$ 4.899)
```

**Passo 2**: Salvar favorito
```
Usuário: Clica em "SALVAR"
Sistema: 
  - Chama saveFavorite(oferta)
  - Salva em localStorage
  - Atualiza estado do React
  - Botão muda para "SALVO"
```

**Passo 3**: Acessar favoritos
```
Usuário: Clica na tab "FAVORITOS"
Sistema: 
  - Carrega getFavorites()
  - Renderiza lista com 1 item
  - Mostra: Fast Shop | iPhone 15 | R$ 4.899
```

**Passo 4**: Remover favorito (opcional)
```
Usuário: Clica no X vermelho
Sistema:
  - Chama removeFavorite('Fast Shop', 'iPhone 15...')
  - Remove do localStorage
  - Atualiza lista (agora vazia)
```

---

## ARQUITETURA V1

```
src/
├── App.jsx                    # UI principal com tabs
├── services/
│   ├── nexusService.js        # Busca de preços (V0)
│   └── storageService.js      # NEW: Favoritos + Histórico
└── index.css                  # Estilos (V0 + V1)
```

**Mudanças em relação a V0**:
- ✓ Novo arquivo: `storageService.js`
- ✓ App.jsx: Adicionado tabs e lógica de favoritos/histórico
- ✓ index.css: Novos estilos para tabs, listas, botões
- ✓ Mantido: Toda lógica de busca e ordenação (V0 intacta)

---

## VALIDAÇÃO V1

### Testes Realizados:
1. ✓ Salvar favorito
2. ✓ Evitar duplicatas
3. ✓ Remover favorito
4. ✓ Salvar histórico automaticamente
5. ✓ Limite de 10 itens no histórico
6. ✓ Restaurar busca do histórico
7. ✓ Persistência após reload

### Build:
- ✓ Build de produção: SUCCESS
- ✓ Tamanho: ~150KB (otimizado)
- ✓ Sem erros de compilação

---

## CONFIRMAÇÃO

**✓ V1 PRONTO LOCALMENTE**

**Status**:
- Favoritos: FUNCIONAL
- Histórico: FUNCIONAL
- Persistência: VALIDADA
- Build: SUCCESS
- V0: INTACTO (nenhuma quebra)

**Próximos Passos**:
- Deploy V1 (mesmo processo que V0)
- Testes em produção
- Aguardar comando para V2 (Alertas de Preço)
