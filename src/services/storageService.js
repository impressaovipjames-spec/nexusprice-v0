// STORAGE SERVICE - V1
// Gerencia Favoritos e Histórico via localStorage

const STORAGE_KEYS = {
    FAVORITES: 'nexusprice_favorites',
    HISTORY: 'nexusprice_history'
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
