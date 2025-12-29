// MOCK SERVICE FOR MVP
// In production, this would connect to Google Shopping API or similar.

const MOCK_DB = [
    {
        terms: ['iphone', '15', '128'],
        offers: [
            {
                loja: 'Amazon',
                produto: 'Apple iPhone 15 (128 GB) - Preto',
                preco_base: 4899.00,
                custo_frete: 0,
                prazo_dias: 2,
                reputacao: 'Alta',
                link: '#'
            },
            {
                loja: 'Casas Bahia',
                produto: 'Apple iPhone 15 (128 GB) - Preto',
                preco_base: 4850.00,
                custo_frete: 50.00,
                prazo_dias: 5,
                reputacao: 'Média',
                link: '#'
            },
            {
                loja: 'Fast Shop',
                produto: 'Apple iPhone 15 (128 GB) - Preto',
                preco_base: 4899.00,
                custo_frete: 0,
                prazo_dias: 1,
                reputacao: 'Alta',
                link: '#'
            }
        ]
    },
    {
        terms: ['samsung', 's23', 'ultra'],
        offers: [
            {
                loja: 'Magalu',
                produto: 'Samsung Galaxy S23 Ultra 5G 512GB',
                preco_base: 5999.00,
                custo_frete: 0,
                prazo_dias: 1,
                reputacao: 'Alta',
                link: '#'
            }
        ]
    },
    {
        terms: ['ps5', 'slim'],
        offers: [
            {
                loja: 'Kabum',
                produto: 'Console PlayStation 5 Slim',
                preco_base: 3499.90,
                custo_frete: 25.00,
                prazo_dias: 3,
                reputacao: 'Alta',
                link: '#'
            }
        ]
    }
];

export async function searchProduct(query) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();

    // Simple Mock Search Logic
    const match = MOCK_DB.find(item =>
        item.terms.every(term => lowerQuery.includes(term))
    );

    if (match) {
        const offers = match.offers;

        // Calculate preco_total for all offers
        const processedOffers = offers.map(offer => ({
            ...offer,
            preco_total: offer.preco_base + (offer.custo_frete || 0)
        }));

        // ORDENAÇÃO DETERMINÍSTICA
        // 1. Menor preço total
        // 2. Melhor reputação (Alta > Média > Baixa)
        // 3. Menor prazo
        const reputacaoScore = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };

        const sorted = processedOffers.sort((a, b) => {
            // Critério 1: Menor preço total
            if (a.preco_total !== b.preco_total) {
                return a.preco_total - b.preco_total;
            }

            // Critério 2: Melhor reputação
            const repA = reputacaoScore[a.reputacao] || 0;
            const repB = reputacaoScore[b.reputacao] || 0;
            if (repA !== repB) {
                return repB - repA; // Descendente (maior é melhor)
            }

            // Critério 3: Menor prazo
            return a.prazo_dias - b.prazo_dias;
        });

        // Retorna o Top 1
        return {
            success: true,
            data: sorted[0]
        };
    }

    // Fallback for demo if no match found
    // In a real scenario, this would return proper error or perform live search
    if (query.length > 3) {
        return {
            success: true,
            data: {
                loja: 'Varejo Demo',
                produto: query, // Echo user query as product name for demo
                preco_base: 199.90,
                custo_frete: 15.00,
                preco_total: 214.90,
                prazo_dias: 5,
                reputacao: 'Média',
                link: '#'
            }
        }
    }

    return { success: false, error: 'Produto não encontrado.' };
}
