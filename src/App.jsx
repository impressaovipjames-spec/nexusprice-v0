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
                {/* TOP HEADER AREA WITH BACKGROUND IMAGE */}
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
                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 20 }}>search</span>
                            <input
                                type="text"
                                placeholder="Pesquisar produto"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: 20 }}>mic</span>
                        </div>
                    </form>
                </div>

                <main className="main-content-flow no-scrollbar">
                    {/* PLACEHOLDER OR RESULT HERO CARD - THIS CREATES THE "CUT" IN THE GREEN BASE */}
                    <div className="hero-card-container">
                        <div className="hero-card-main">
                            {result ? (
                                <>
                                    <div style={{ position: 'absolute', top: 16, left: 16, background: '#1dba84', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '4px 12px', borderRadius: '8px' }}>Melhor escolha</div>
                                    <div className="hero-visual">
                                        <img src={result.image} alt={result.productName} />
                                    </div>
                                    <div className="hero-details">
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{result.productName}</h2>
                                        <div className="hero-product-price">{formatBRL(result.offers[0].preco_total)}</div>
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1dba84' }}>check_circle</span>
                                                {result.offers[0].loja}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Frete grátis • Chega amanhã</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', flexDirection: 'column', gap: '8px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 48 }}>shopping_cart</span>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Aguardando sua pesquisa...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div className="spinner-lux" style={{ margin: '0 auto', width: 32, height: 32, border: '3px solid rgba(29,186,132,0.1)', borderTopColor: '#1dba84', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        </div>
                    )}

                    {result && activeTab === 'search' && (
                        <>
                            <div style={{ padding: '0 1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Outras ótimas opções</h3>
                                <span style={{ color: '#1dba84', fontSize: '0.8rem', fontWeight: 700 }}>Ver mais</span>
                            </div>
                            <div className="options-carousel no-scrollbar">
                                {result.offers.slice(1, 6).map((offer, idx) => (
                                    <div key={idx} className="option-card">
                                        <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={result.image} alt="product" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1dba84', marginTop: '8px' }}>{formatBRL(offer.preco_total)}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{offer.loja}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>

                {/* BOTTOM NAVIGATION FIXED */}
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
            `}</style>
        </>
    )
}

export default App
