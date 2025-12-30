# NEXUSPRICE V2 — DOCUMENTAÇÃO TÉCNICA

## FEATURES V2

### 1. ALERTAS DE PREÇO (SIMPLIFICADO)

**Descrição**: Sistema de notificação quando o preço atinge valor definido pelo usuário.

**Funcionalidades**:
- Botão "CRIAR ALERTA" no card de resultado
- Modal para definir preço alvo
- Verificação automática a cada nova busca
- Notificação visual quando alerta é ativado
- Tab dedicada para gerenciar alertas
- Persistência local (localStorage)

**Fluxo**:
1. Usuário busca produto (ex: iPhone 15)
2. Resultado aparece com preço atual (ex: R$ 4.899)
3. Clica em "CRIAR ALERTA"
4. Define preço alvo no modal (ex: R$ 4.500)
5. Alerta é salvo
6. Quando usuário buscar novamente e preço ≤ R$ 4.500:
   - Notificação laranja aparece no topo
   - Alerta é marcado como "ATIVADO"

**Limitações (V2)**:
- Sem verificação automática em background
- Sem emails ou push notifications
- Verificação ocorre apenas quando:
  * Usuário abre o site
  * Usuário faz nova busca do mesmo produto

---

### 2. PERSISTÊNCIA V2 (ESTRUTURA UNIFICADA)

**localStorage Keys**:
```javascript
{
  "nexusprice_favorites": [...],  // Favoritos
  "nexusprice_history": [...],    // Histórico
  "nexusprice_alerts": [...]      // Alertas (NOVO)
}
```

**Estrutura de Alerta**:
```javascript
{
  query: "iPhone 15 128gb",
  targetPrice: 4500.00,
  createdAt: "2025-12-29T20:45:00.000Z",
  triggered: false  // true quando ativado
}
```

**Vantagens**:
- Código organizado para futura migração para backend
- Separação clara de responsabilidades
- Fácil exportação/importação de dados

---

### 3. MONETIZAÇÃO LEVE (VISUAL)

**Badge "LINK PATROCINADO"**:
- Aparece no botão "IR PARA A LOJA"
- Cor laranja (#ff9800) para destaque
- Preparação visual para futuros links de afiliados

**Implementação Atual**:
```jsx
<a href={result.link} className="buy-button">
  <span className="sponsored-badge">LINK PATROCINADO</span>
  IR PARA A LOJA
</a>
```

**Próximos Passos (V3)**:
- Integrar links de afiliados reais
- Tracking de cliques
- Conversão de URLs

---

## COMO FUNCIONAM OS ALERTAS

### Criação de Alerta
1. Usuário busca produto
2. Clica em "CRIAR ALERTA"
3. Modal abre mostrando:
   - Nome do produto
   - Preço atual
   - Input para preço alvo
4. Define preço alvo e confirma
5. Alerta salvo em `localStorage`

### Verificação de Alerta
```javascript
// A cada busca bem-sucedida
const triggered = checkAlerts(query, preco_total)

if (triggered.length > 0) {
  // Mostrar notificação
  // Marcar alerta como triggered
}
```

### Lógica de Ativação
```javascript
if (preco_atual <= preco_alvo && !alerta.triggered) {
  alerta.triggered = true
  // Exibir notificação
}
```

---

## ESTRUTURA DE DADOS (localStorage)

### Completa (V0 + V1 + V2)

```javascript
// FAVORITOS (V1)
localStorage.getItem('nexusprice_favorites')
[
  {
    loja: 'Amazon',
    produto: 'iPhone 15 128GB',
    preco_base: 4899,
    custo_frete: 0,
    preco_total: 4899,
    prazo_dias: 2,
    reputacao: 'Alta',
    link: '#',
    savedAt: '2025-12-29T20:00:00.000Z'
  }
]

// HISTÓRICO (V1)
localStorage.getItem('nexusprice_history')
[
  {
    query: 'iPhone 15',
    result: { /* oferta completa */ },
    searchedAt: '2025-12-29T20:00:00.000Z'
  }
]

// ALERTAS (V2 - NOVO)
localStorage.getItem('nexusprice_alerts')
[
  {
    query: 'iPhone 15 128gb',
    targetPrice: 4500.00,
    createdAt: '2025-12-29T20:00:00.000Z',
    triggered: false
  }
]
```

---

## ARQUITETURA V2

```
src/
├── App.jsx                    # UI com 4 tabs + modal
├── services/
│   ├── nexusService.js        # Busca de preços (V0)
│   └── storageService.js      # ATUALIZADO: + Alertas
└── index.css                  # ATUALIZADO: + estilos V2
```

**Mudanças em relação a V1**:
- ✓ storageService.js: Adicionadas funções de alertas
- ✓ App.jsx: Nova tab "ALERTAS", modal, notificação
- ✓ index.css: Estilos para modal, notificação, badge
- ✓ Mantido: Toda lógica V0/V1 intacta

---

## VALIDAÇÃO V2

### Testes Funcionais:
1. ✓ Criar alerta com preço alvo
2. ✓ Verificar alerta em nova busca
3. ✓ Notificação quando preço atinge alvo
4. ✓ Marcar alerta como "ATIVADO"
5. ✓ Remover alerta
6. ✓ Badge "LINK PATROCINADO" visível
7. ✓ Modal responsivo e funcional

### Build:
- ✓ Build de produção: SUCCESS
- ✓ Tamanho: ~154KB (otimizado)
- ✓ Sem erros de compilação

---

## CONFIRMAÇÃO

**✓ V2 PRONTO LOCALMENTE**

**Status**:
- Alertas de Preço: FUNCIONAL
- Persistência V2: VALIDADA
- Monetização Visual: IMPLEMENTADA
- Build: SUCCESS
- V0/V1: INTACTOS (nenhuma quebra)

**Próximos Passos**:
- Deploy V2 (mesmo processo que V1)
- Testes em produção
- Aguardar comando para V3 (Backend + Jurídico + Escala SaaS)
