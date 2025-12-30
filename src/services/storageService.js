// STORAGE SERVICE - V2
// Gerencia Favoritos, Histórico e Alertas de Preço via localStorage

const STORAGE_KEYS = {
    FAVORITES: 'nexusprice_favorites',
    HISTORY: 'nexusprice_history',
    ALERTS: 'nexusprice_alerts'
};

const MAX_HISTORY_ITEMS = 10;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAVORITOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function saveFavorite(offer) {
    const favorites = getFavorites();

    // Evitar duplicatas (por loja + produto)
    const exists = favorites.some(
        fav => fav.loja === offer.loja && fav.produto === offer.produto
    );

    if (!exists) {
        favorites.unshift({
            ...offer,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
}

export function removeFavorite(loja, produto) {
    const favorites = getFavorites();
    const filtered = favorites.filter(
        fav => !(fav.loja === loja && fav.produto === produto)
    );
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
}

export function getFavorites() {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
}

export function isFavorite(loja, produto) {
    const favorites = getFavorites();
    return favorites.some(
        fav => fav.loja === loja && fav.produto === produto
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HISTÓRICO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function saveToHistory(query, result) {
    const history = getHistory();

    // Adicionar no início
    history.unshift({
        query,
        result,
        searchedAt: new Date().toISOString()
    });

    // Limitar a MAX_HISTORY_ITEMS
    const limited = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limited));
}

export function getHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ALERTAS DE PREÇO (V2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function saveAlert(query, targetPrice) {
    const alerts = getAlerts();

    // Evitar duplicatas por query
    const exists = alerts.some(alert => alert.query.toLowerCase() === query.toLowerCase());

    if (!exists) {
        alerts.unshift({
            query,
            targetPrice: parseFloat(targetPrice),
            createdAt: new Date().toISOString(),
            triggered: false
        });
        localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
}

export function removeAlert(query) {
    const alerts = getAlerts();
    const filtered = alerts.filter(alert => alert.query !== query);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(filtered));
}

export function getAlerts() {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : [];
}

export function hasAlert(query) {
    const alerts = getAlerts();
    return alerts.some(alert => alert.query.toLowerCase() === query.toLowerCase());
}

export function checkAlerts(currentQuery, currentPrice) {
    const alerts = getAlerts();
    const triggered = [];

    alerts.forEach(alert => {
        if (alert.query.toLowerCase() === currentQuery.toLowerCase() && !alert.triggered) {
            if (currentPrice <= alert.targetPrice) {
                alert.triggered = true;
                triggered.push(alert);
            }
        }
    });

    // Atualizar localStorage com alertas marcados como triggered
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));

    return triggered;
}
