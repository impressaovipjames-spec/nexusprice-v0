import { useState, useEffect } from 'react'
import { searchProduct } from './services/nexusService'
import { saveFavorite, removeFavorite, getFavorites, isFavorite, saveToHistory, getHistory } from './services/storageService'
import { Heart, Clock, X } from 'lucide-react'

function App() {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [favorites, setFavorites] = useState([])
    const [history, setHistory] = useState([])
    const [activeTab, setActiveTab] = useState('search') // search | favorites | history

    useEffect(() => {
        setFavorites(getFavorites())
        setHistory(getHistory())
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setResult(null)
        setError(null)

        try {
            const response = await searchProduct(query)
            if (response.success) {
                setResult(response.data)
                saveToHistory(query, response.data)
                setHistory(getHistory())
            } else {
                setError(response.error)
            }
        } catch (err) {
            setError('Erro ao processar busca.')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveFavorite = () => {
        if (result) {
            saveFavorite(result)
            setFavorites(getFavorites())
        }
    }

    const handleRemoveFavorite = (loja, produto) => {
        removeFavorite(loja, produto)
        setFavorites(getFavorites())
    }

    const handleHistoryClick = (item) => {
        setQuery(item.query)
        setResult(item.result)
        setActiveTab('search')
    }

    return (
        <div className="container">
            <div className="header">NEXUSPRICE</div>

            {/* TABS */}
            <div className="tabs">
                <button
                    className={activeTab === 'search' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('search')}
                >
                    BUSCAR
                </button>
                <button
                    className={activeTab === 'favorites' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('favorites')}
                >
                    <Heart size={16} /> FAVORITOS ({favorites.length})
                </button>
                <button
                    className={activeTab === 'history' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('history')}
                >
                    <Clock size={16} /> HISTÓRICO ({history.length})
                </button>
            </div>

            {/* TAB: BUSCAR */}
            {activeTab === 'search' && (
                <>
                    <form className="search-box" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Qual o melhor preço de [Produto]?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? '...' : 'BUSCAR'}
                        </button>
                    </form>

                    {loading && (
                        <div className="loader">
                            &gt;&gt; ORION 3.0 INICIANDO PROTOCOLO DE BUSCA...<br />
                            &gt;&gt; VARRENDO FONTES...<br />
                            &gt;&gt; NORMALIZANDO CUSTO TOTAL...
                        </div>
                    )}

                    {error && (
                        <div style={{ marginTop: '2rem', color: '#ff4444' }}>
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="result-card">
                            <div className="card-header">
                                <span className="store-name">{result.loja}</span>
                                <button
                                    className="favorite-btn"
                                    onClick={handleSaveFavorite}
                                    disabled={isFavorite(result.loja, result.produto)}
                                >
                                    <Heart
                                        size={20}
                                        fill={isFavorite(result.loja, result.produto) ? '#fff' : 'none'}
                                    />
                                    {isFavorite(result.loja, result.produto) ? 'SALVO' : 'SALVAR'}
                                </button>
                            </div>

                            <div className="product-name">{result.produto}</div>

                            <div className="pricing">
                                <div className="total-price">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.preco_total)}
                                </div>
                                <div className="price-details">
                                    Preço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.preco_base)} +
                                    Frete: {result.custo_frete === 0 ? 'Grátis' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.custo_frete)}
                                </div>
                            </div>

                            <div className="meta-grid">
                                <div className="meta-item">
                                    <span className="meta-label">Prazo</span>
                                    <span className="meta-value">{result.prazo_dias} {result.prazo_dias === 1 ? 'dia' : 'dias'}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Reputação</span>
                                    <span className="meta-value" style={{
                                        color: result.reputacao === 'Alta' ? '#4caf50' :
                                            result.reputacao === 'Média' ? '#ff9800' : '#f44336'
                                    }}>
                                        {result.reputacao}
                                    </span>
                                </div>
                            </div>

                            <div className="justification">
                                Esta é a melhor oferta considerando preço total, frete e reputação no momento.
                            </div>

                            <a href={result.link} className="buy-button" target="_blank" rel="noopener noreferrer">
                                IR PARA A LOJA
                            </a>
                        </div>
                    )}
                </>
            )}

            {/* TAB: FAVORITOS */}
            {activeTab === 'favorites' && (
                <div className="list-container">
                    {favorites.length === 0 ? (
                        <div className="empty-state">
                            <Heart size={48} color="#333" />
                            <p>Nenhum favorito salvo ainda.</p>
                        </div>
                    ) : (
                        favorites.map((fav, idx) => (
                            <div key={idx} className="list-item">
                                <div className="list-item-header">
                                    <span className="store-name">{fav.loja}</span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveFavorite(fav.loja, fav.produto)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="list-item-product">{fav.produto}</div>
                                <div className="list-item-price">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fav.preco_total)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TAB: HISTÓRICO */}
            {activeTab === 'history' && (
                <div className="list-container">
                    {history.length === 0 ? (
                        <div className="empty-state">
                            <Clock size={48} color="#333" />
                            <p>Nenhuma busca realizada ainda.</p>
                        </div>
                    ) : (
                        history.map((item, idx) => (
                            <div
                                key={idx}
                                className="list-item clickable"
                                onClick={() => handleHistoryClick(item)}
                            >
                                <div className="list-item-query">"{item.query}"</div>
                                <div className="list-item-result">
                                    {item.result.loja} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.result.preco_total)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default App
