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
    const [alerts, setAlerts] = useState([])
    const [activeTab, setActiveTab] = useState('search')
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [targetPrice, setTargetPrice] = useState('')
    const [triggeredAlerts, setTriggeredAlerts] = useState([])
    const [showSplash, setShowSplash] = useState(true)

    useEffect(() => {
        setFavorites(getFavorites())
        setHistory(getHistory())
        setAlerts(getAlerts())
        const timer = setTimeout(() => setShowSplash(false), 5500)
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
                <div className={`splash-screen ${!showSplash ? '' : 'splash-fade-out'}`}>
                    <div className="splash-content">
                        <img src="/assets/logo_solo.png" alt="$" className="logo-symbol" />
                    </div>
                </div>
            )}

            <div className="app-wrapper">
                <div className="top-section">
                    <header className="main-header">
                        <button className="icon-btn"><span className="material-symbols-outlined">notes</span></button>
                        <div className="header-brand">
                            <img src="/assets/logo_completa.png" alt="NEXUSPRICE" />
                        </div>
                        <div className="icon-btn">
                            <span className="material-symbols-outlined">notifications</span>
                        </div>
                    </header>

                    <main className="main-content no-scrollbar" style={{ paddingBottom: 0 }}>
                        {activeTab === 'search' && (
                            <>
                                <div className="headline">
                                    <h1>Melhor preço encontrado para você</h1>
                                </div>

                                <form className="search-container" onSubmit={handleSearch}>
                                    <div className="search-bar">
                                        <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>search</span>
                                        <input
                                            type="text"
                                            placeholder="Pesquisar produto"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                        />
                                        <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>mic</span>
                                    </div>
                                </form>
                            </>
                        )}
                    </main>
                </div>

                <main className="main-content no-scrollbar" style={{ paddingTop: '1.5rem' }}>
                    {activeTab === 'search' && (
                        <>
                            {loading && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#10b77f' }}>
                                    <div className="spinner-ring" style={{ margin: '0 auto', borderColor: 'rgba(16,183,127,0.1)', borderTopColor: '#10b77f' }}></div>
                                </div>
                            )}

                            {result && (
                                <>
                                    {/* HORIZONTAL HERO (MELHOR ESCOLHA) */}
                                    <div className="hero-selection" onClick={() => window.open(result.offers[0].link, '_blank')}>
                                        <div className="hero-tag">Melhor escolha</div>
                                        <div className="hero-thumb">
                                            <img src={result.image} alt={result.productName} />
                                        </div>
                                        <div className="hero-info">
                                            <h2 className="hero-name">{result.productName}</h2>
                                            <div className="hero-price">{formatBRL(result.offers[0].preco_total)}</div>
                                            <div className="hero-store-line">
                                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#10b77f' }}>verified</span>
                                                {result.offers[0].loja}
                                            </div>
                                            <div className="hero-badges">
                                                <div className="clean-badge success">✓ Frete Grátis</div>
                                                <div className="clean-badge">Amanhã</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CAROUSEL - SEGUNDO AO QUINTO MELHOR */}
                                    {result.offers.length > 1 && (
                                        <>
                                            <div className="section-header">
                                                <h3>Outras ótimas opções</h3>
                                                <span style={{ fontSize: '0.8rem', color: '#10b77f' }}>Ver mais</span>
                                            </div>
                                            <div className="horizontal-scroll">
                                                {result.offers.slice(1, 5).map((offer, idx) => (
                                                    <div key={idx} className="small-card" onClick={() => window.open(offer.link, '_blank')}>
                                                        <div style={{ position: 'relative', marginBottom: '8px' }}>
                                                            <img src={result.image} alt="prev" />
                                                            <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(16,183,127,0.1)', color: '#10b77f', padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>#{idx + 2}</div>
                                                        </div>
                                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#10b77f' }}>{formatBRL(offer.preco_total)}</div>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px' }}>{offer.loja}</div>
                                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>
                                                            {offer.custo_frete === 0 ? '✓ Frete Grátis' : `+ ${formatBRL(offer.custo_frete)} frete`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* TODAS AS LOJAS (LISTA) */}
                                    <div className="section-header" style={{ marginTop: '1rem' }}>
                                        <h3>Todos os preços disponíveis</h3>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#94a3b8' }}>sort</span>
                                    </div>
                                    <div className="store-list">
                                        {result.offers.map((offer, idx) => (
                                            <div key={idx} className="store-row" onClick={() => window.open(offer.link, '_blank')}>
                                                <div className="store-logo">
                                                    <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>store</span>
                                                </div>
                                                <div className="store-details">
                                                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        {offer.loja}
                                                        {idx === 0 && <span style={{ background: '#76d2b1', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '4px' }}>MELHOR</span>}
                                                    </div>
                                                    <div className="store-meta">Entrega em {offer.prazo_dias} dias • {offer.custo_frete === 0 ? 'Frete Grátis' : `Frete: ${formatBRL(offer.custo_frete)}`}</div>
                                                </div>
                                                <div className="store-price-area">
                                                    <div className="store-price">{formatBRL(offer.preco_total)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ABAS COM ESTILO CLEAN */}
                    {activeTab === 'favorites' && (
                        <div style={{ padding: '0 1.5rem' }}>
                            <h2 style={{ margin: '1rem 0' }}>Itens Salvos</h2>
                            {favorites.map((fav, i) => (
                                <div key={i} className="store-row">
                                    <div className="store-details" style={{ marginLeft: 0 }}>
                                        <div style={{ fontWeight: 700 }}>{fav.produto}</div>
                                        <div className="store-meta">{fav.loja}</div>
                                    </div>
                                    <div className="store-price-area">
                                        <div className="store-price" style={{ color: '#10b77f' }}>{formatBRL(fav.preco_total)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <nav className="bottom-nav-container">
                    <div className="bottom-nav">
                        <button className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            <span className="material-symbols-outlined">home</span>
                            <span style={{ fontSize: '9px', fontWeight: 700 }}>HOME</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
                            <span className="material-symbols-outlined">bookmark</span>
                            <span style={{ fontSize: '9px', fontWeight: 700 }}>SALVOS</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                            <span className="material-symbols-outlined">history</span>
                            <span style={{ fontSize: '9px', fontWeight: 700 }}>HISTÓRICO</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
                            <span className="material-symbols-outlined">notifications</span>
                            <span style={{ fontSize: '9px', fontWeight: 700 }}>ALERTAS</span>
                        </button>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default App
