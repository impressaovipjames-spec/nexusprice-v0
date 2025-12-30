import { useState, useEffect } from 'react'
import { searchProduct } from './services/nexusService'
import { saveFavorite, removeFavorite, getFavorites, isFavorite, saveToHistory, getHistory, saveAlert, removeAlert, getAlerts, hasAlert, checkAlerts } from './services/storageService'

function App() {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [favorites, setFavorites] = useState([])
    const [history, setHistory] = useState([])
    const [activeTab, setActiveTab] = useState('search')
    const [showSplash, setShowSplash] = useState(true)

    useEffect(() => {
        setFavorites(getFavorites())
        setHistory(getHistory())
        const timer = setTimeout(() => setShowSplash(false), 4500)
        return () => clearTimeout(timer)
    }, [])

    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        if (!query.trim()) return
        setLoading(true); setResult(null); setError(null);
        try {
            const response = await searchProduct(query)
            if (response.success) {
                setResult(response.data)
                saveToHistory(query, response.data.offers[0])
                setHistory(getHistory())
            }
        } finally { setLoading(false) }
    }

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    return (
        <>
            {showSplash && (
                <div className="splash-fullscreen">
                    <img src="/assets/logo_solo.png" alt="NexusPrice" style={{ width: 120 }} />
                </div>
            )}

            <div className="app-wrapper">
                {/* TOP HEADER TEAL AREA */}
                <div className="top-banner no-scrollbar">
                    <header className="header-row">
                        <span className="material-symbols-outlined icon-white">notes</span>
                        <div className="logo-center">
                            <img src="/assets/logo_completa.png" alt="NEXUSPRICE" />
                        </div>
                        <span className="material-symbols-outlined icon-white">notifications</span>
                    </header>

                    <div className="headline-box">
                        <h1>Melhor preço encontrado para você</h1>
                    </div>

                    <form className="search-wrapper" onSubmit={handleSearch}>
                        <div className="search-input-group">
                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 24 }}>search</span>
                            <input
                                type="text"
                                placeholder="Pesquisar produto"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 24 }}>mic</span>
                        </div>
                    </form>
                </div>

                <main className="main-content-flow no-scrollbar">
                    {loading && (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <div className="spinner-lux" style={{ margin: '0 auto', width: 44, height: 44, border: '4px solid rgba(29,186,132,0.1)', borderTopColor: '#1dba84', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }}></div>
                            <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#1dba84', fontWeight: 700, letterSpacing: '0.1em' }}>ORION 3.0 VARRENDO O MERCADO...</p>
                        </div>
                    )}

                    {result && activeTab === 'search' && (
                        <>
                            {/* MASSIVE HERO CARD (ENCHA OS OLHOS) */}
                            <div className="hero-card-container">
                                <div className="hero-card-main" onClick={() => window.open(result.offers[0].link, '_blank')}>
                                    <div className="hero-pill">Melhor escolha</div>
                                    <div className="hero-visual">
                                        <img src={result.image} alt={result.productName} />
                                    </div>
                                    <div className="hero-details">
                                        <h2 className="hero-product-name">{result.productName}</h2>
                                        <div className="hero-product-price">{formatBRL(result.offers[0].preco_total)}</div>

                                        <div className="hero-store-line">
                                            <div className="store-icon-mini">
                                                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#94a3b8' }}>store</span>
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{result.offers[0].loja}</span>
                                        </div>

                                        <div className="hero-checks">
                                            <div className="check-line">
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1dba84' }}>check_circle</span>
                                                Frete grátis
                                            </div>
                                            <div className="check-line">
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1dba84' }}>schedule</span>
                                                Chega amanhã
                                            </div>
                                            <div className="check-line">
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1dba84' }}>verified</span>
                                                Altamente confiável
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SEÇÃO SEGUNDO MELHOR (CARROSSEL) */}
                            <div className="section-label">
                                <h3>Segundo melhor</h3>
                                <span className="view-more-teal">Ver mais</span>
                            </div>
                            <div className="options-carousel no-scrollbar">
                                {result.offers.slice(1, 6).map((offer, idx) => (
                                    <div key={idx} className="option-card" onClick={() => window.open(offer.link, '_blank')}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={result.image} alt="prev" />
                                            <div style={{ position: 'absolute', top: 8, right: 8, background: '#1dba84', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '8px' }}>#{idx + 2}</div>
                                        </div>
                                        <div className="option-price">{formatBRL(offer.preco_total)}</div>
                                        <div className="option-store">{offer.loja}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#1dba84', marginTop: '6px', fontWeight: 600 }}>
                                            {offer.custo_frete === 0 ? '✓ Frete Grátis' : `+ ${formatBRL(offer.custo_frete)} frete`}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* LISTA COMPLETA DE EMPRESAS */}
                            <div className="section-label" style={{ marginTop: '0.5rem' }}>
                                <h3>Outros produtos populares</h3>
                                <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#94a3b8' }}>chevron_right</span>
                            </div>
                            <div className="store-list-area">
                                {result.offers.map((offer, idx) => (
                                    <div key={idx} className="store-entry" onClick={() => window.open(offer.link, '_blank')}>
                                        <div className="store-entry-logo">
                                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 24 }}>shopping_basket</span>
                                        </div>
                                        <div className="store-entry-info">
                                            <div className="store-entry-name">{offer.loja}</div>
                                            <div className="store-entry-ratings">★★★★★ • Top Loja</div>
                                        </div>
                                        <div className="store-entry-pricing">
                                            <div className="store-entry-price">{formatBRL(offer.preco_total)}</div>
                                            {idx === 0 ? (
                                                <div style={{ background: '#1dba84', color: '#fff', fontSize: '8px', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>MELHOR PREÇO</div>
                                            ) : (
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Entrega: {offer.prazo_dias}d</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>

                {/* BOTTOM NAV LUXURY */}
                <div className="nav-bottom-luxury">
                    <div className="nav-bar-white">
                        <button className={`nav-bar-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            <span className="material-symbols-outlined">home</span>
                            <span className="nav-bar-label">HOME</span>
                        </button>
                        <button className={`nav-bar-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
                            <span className="material-symbols-outlined">bookmark</span>
                            <span className="nav-bar-label">SALVOS</span>
                        </button>
                        <button className={`nav-bar-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                            <span className="material-symbols-outlined">history</span>
                            <span className="nav-bar-label">HISTÓRICO</span>
                        </button>
                        <button className={`nav-bar-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="nav-bar-label">ALERTAS</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .splash-fullscreen img { animation: splashPulse 1.5s infinite alternate; }
                @keyframes splashPulse { from { transform: scale(1); } to { transform: scale(1.1); } }
            `}</style>
        </>
    )
}

export default App
