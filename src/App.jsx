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
        const timer = setTimeout(() => setShowSplash(false), 6500)
        return () => clearTimeout(timer)
    }, [])

    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        if (!query.trim()) return
        setLoading(true)
        setResult(null)
        setError(null)
        setTriggeredAlerts([])
        try {
            const response = await searchProduct(query)
            if (response.success) {
                setResult(response.data)
                const bestOffer = response.data.offers[0]
                saveToHistory(query, bestOffer)
                setHistory(getHistory())
                const triggered = checkAlerts(query, bestOffer.preco_total)
                if (triggered.length > 0) {
                    setTriggeredAlerts(triggered)
                    setAlerts(getAlerts())
                }
            } else { setError(response.error) }
        } catch (err) { setError('Erro ao processar busca.') }
        finally { setLoading(false) }
    }

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    return (
        <>
            {showSplash && (
                <div className={`splash-screen ${!showSplash ? '' : 'splash-fade-out'}`}>
                    <div className="splash-content">
                        <img src="/assets/logo_solo.png" alt="$" className="logo-symbol" />
                        <img src="/assets/logo_completa.png" alt="NEXUSPRICE" className="logo-reveal-text" />
                    </div>
                </div>
            )}

            <div className="app-wrapper">
                <header className="main-header">
                    <button className="icon-btn"><span className="material-symbols-outlined">menu</span></button>
                    <div className="header-brand">
                        <img src="/assets/logo_completa.png" alt="NEXUSPRICE" style={{ height: '32px', width: 'auto' }} />
                    </div>
                    <div className="profile-avatar">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA76krzlsAu0S-WAnKiLWqyyE2ilm-0GgdzPNZaVIbPhCBpR1XDWxjs1vSJpfzoUGV1EVRG1nYD7MQ_tcRgudMql6fSRdVc4hYaWjmLYVz8XnYJRF-RCyM1OPrpKn0ftV3UZi9wYR1xHNl3pqTkuL6MGMh2iwNfZbBB6u4_sItoSPE5aSV-P3_6mljXmuAboJJ-ERR1eORfAA94L-zSfqD1uApVXAH2ZUIszzqVZdNRXhKqaJy52-7hpIOXTu3orx7Cs_JwK_OC7k13" alt="User" />
                        <div className="status-dot"></div>
                    </div>
                </header>

                <main className="main-content no-scrollbar">
                    {activeTab === 'search' && (
                        <>
                            <div className="headline">
                                <h1>Melhor preço <br /><span>encontrado para você</span></h1>
                            </div>

                            <form className="search-container" onSubmit={handleSearch}>
                                <div className="search-bar">
                                    <span className="material-symbols-outlined" style={{ opacity: 0.5 }}>search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button type="button" className="icon-btn" style={{ opacity: 0.5 }}><span className="material-symbols-outlined">mic</span></button>
                                </div>
                            </form>

                            {loading && (
                                <div className="loading-indicator">
                                    <div className="spinner-ring"></div>
                                    <p className="loading-text">ORION 3.0 VARRENDO O MERCADO...</p>
                                </div>
                            )}

                            {triggeredAlerts.length > 0 && (
                                <div className="hero-card" style={{ background: 'var(--primary)', color: '#0b1a15', padding: '1rem', marginBottom: '1rem' }}>
                                    <div className="badge-item"><span className="material-symbols-outlined">bolt</span> <strong>Alerta Ativado!</strong></div>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Preço alvo de {formatBRL(triggeredAlerts[0].targetPrice)} atingido.</p>
                                </div>
                            )}

                            {result && (
                                <>
                                    <div className="hero-card">
                                        <div className="hero-image-area">
                                            <div className="best-badge">Melhor Escolha</div>
                                            <img src={result.image} alt={result.productName} />
                                        </div>
                                        <div className="hero-content">
                                            <div className="hero-product-title">
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <h2>{result.productName}</h2>
                                                        <p className="hero-product-meta">{result.offers[0].loja} • Confiável</p>
                                                    </div>
                                                    <button
                                                        className="icon-btn"
                                                        onClick={() => { saveFavorite(result.offers[0]); setFavorites(getFavorites()); }}
                                                        style={{ color: isFavorite(result.offers[0].loja, result.offers[0].produto) ? 'var(--primary)' : '#fff' }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite(result.offers[0].loja, result.offers[0].produto) ? "'FILL' 1" : "" }}>favorite</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="hero-price-row">
                                                <div>
                                                    <span className="hero-price-value">{formatBRL(result.offers[0].preco_total)}</span>
                                                    <div className="hero-badges">
                                                        <div className="badge-item"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_shipping</span> Frete Grátis</div>
                                                        <div className="badge-item"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span> Top Store</div>
                                                    </div>
                                                </div>
                                                <button className="go-btn" onClick={() => window.open(result.offers[0].link, '_blank')}>
                                                    <span className="material-symbols-outlined">arrow_forward</span>
                                                </button>
                                            </div>

                                            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                                                <button className="modal-btn secondary" style={{ flex: 1, padding: '8px' }} onClick={() => setShowAlertModal(true)}>
                                                    <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', fontSize: 18, marginRight: 5 }}>notifications</span>
                                                    {hasAlert(query) ? 'Alerta Ativo' : 'Criar Alerta'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section-title">
                                        <h3>Comparar Preços</h3>
                                        <button>Ver todos</button>
                                    </div>

                                    {result.offers.slice(1).map((offer, idx) => (
                                        <div key={idx} className="list-item" onClick={() => window.open(offer.link, '_blank')}>
                                            <div className="item-thumb"><img src={result.image} alt="thumb" /></div>
                                            <div className="item-info">
                                                <div className="item-row">
                                                    <span className="item-name">{offer.loja}</span>
                                                    <span className="item-price">{formatBRL(offer.preco_total)}</span>
                                                </div>
                                                <div className="item-row">
                                                    <span className="item-sub">Entrega: {offer.prazo_dias} dias</span>
                                                    <span className={offer.custo_frete === 0 ? "item-shipping" : "item-shipping extra"}>
                                                        {offer.custo_frete === 0 ? "Frete Grátis" : `+ ${formatBRL(offer.custo_frete)} frete`}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined" style={{ opacity: 0.2 }}>chevron_right</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'favorites' && (
                        <div style={{ marginTop: '1rem' }}>
                            <div className="section-title"><h3>Meus Favoritos</h3></div>
                            {favorites.length === 0 ? <div className="empty-list">Sua lista está vazia.</div> :
                                favorites.map((fav, idx) => (
                                    <div key={idx} className="list-item">
                                        <div className="item-info" style={{ marginLeft: 0 }}>
                                            <div className="item-row">
                                                <span className="item-name">{fav.produto}</span>
                                                <button className="icon-btn" onClick={() => { removeFavorite(fav.loja, fav.produto); setFavorites(getFavorites()); }} style={{ color: '#f87171' }}><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                            <div className="item-row">
                                                <span className="item-sub">{fav.loja}</span>
                                                <span className="item-price">{formatBRL(fav.preco_total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div style={{ marginTop: '1rem' }}>
                            <div className="section-title"><h3>Buscas Recentes</h3></div>
                            {history.length === 0 ? <div className="empty-list">Nenhum histórico encontrado.</div> :
                                history.map((item, idx) => (
                                    <div key={idx} className="list-item" onClick={() => { setQuery(item.query); handleSearchManually(item.query); setActiveTab('search'); }}>
                                        <div className="item-info" style={{ marginLeft: 0 }}>
                                            <div className="item-row">
                                                <span className="item-name">"{item.query}"</span>
                                                <span className="material-symbols-outlined" style={{ opacity: 0.2 }}>history</span>
                                            </div>
                                            <div className="item-sub">{item.result.loja} • {formatBRL(item.result.preco_total)}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {activeTab === 'alerts' && (
                        <div style={{ marginTop: '1rem' }}>
                            <div className="section-title"><h3>Alertas de Preço</h3></div>
                            {alerts.length === 0 ? <div className="empty-list">Nenhum alerta configurado.</div> :
                                alerts.map((alert, idx) => (
                                    <div key={idx} className="list-item">
                                        <div className="item-info" style={{ marginLeft: 0 }}>
                                            <div className="item-row">
                                                <span className="item-name" style={{ color: alert.triggered ? 'var(--primary)' : '#fff' }}>
                                                    {alert.triggered ? '✓ ' : '⏳ '}"{alert.query}"
                                                </span>
                                                <button className="icon-btn" onClick={() => { removeAlert(alert.query); setAlerts(getAlerts()); }}><span className="material-symbols-outlined">close</span></button>
                                            </div>
                                            <div className="item-sub">Preço Alvo: {formatBRL(alert.targetPrice)}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </main>

                <nav className="bottom-nav-container">
                    <div className="bottom-nav">
                        <button className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'search' ? "'FILL' 1" : "" }}>search</span>
                            <span className="nav-label">BUSCAR</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'favorites' ? "'FILL' 1" : "" }}>favorite</span>
                            <span className="nav-label">SALVOS</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'history' ? "'FILL' 1" : "" }}>history</span>
                            <span className="nav-label">RECENTES</span>
                        </button>
                        <button className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'alerts' ? "'FILL' 1" : "" }}>notifications</span>
                            <span className="nav-label">ALERTAS</span>
                        </button>
                    </div>
                </nav>

                {showAlertModal && (
                    <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Criar Alerta</h3>
                            <p>Notificar quando o preço de <strong>{query}</strong> ficar abaixo de:</p>
                            <input
                                type="number"
                                className="modal-input"
                                placeholder="R$ 0,00"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button className="modal-btn secondary" onClick={() => setShowAlertModal(false)}>Cancelar</button>
                                <button className="modal-btn primary" onClick={() => { saveAlert(query, targetPrice); setAlerts(getAlerts()); setShowAlertModal(false); setTargetPrice(''); }}>Ativar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )

    async function handleSearchManually(q) {
        setLoading(true); setResult(null); setError(null);
        try {
            const response = await searchProduct(q)
            if (response.success) setResult(response.data)
        } finally { setLoading(false) }
    }
}

export default App
