// MOCK SERVICE FOR MVP
// In production, this would connect to Google Shopping API or similar.

const MOCK_DB = [
    {
        terms: ['iphone', '15', '128'],
        productName: 'iPhone 15 Apple (128 GB)',
        image: 'https://m.media-amazon.com/images/I/71d7rjTSKdL._AC_SL1500_.jpg',
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
                preco_base: 4799.00,
                custo_frete: 99.00,
                prazo_dias: 1,
                reputacao: 'Alta',
                link: '#'
            },
            {
                loja: 'Mercado Livre',
                produto: 'Apple iPhone 15 (128 GB) - Preto',
                preco_base: 5100.00,
                custo_frete: 0,
                prazo_dias: 2,
                reputacao: 'Alta',
                link: '#'
            }
        ]
    },
    {
        terms: ['samsung', 's23', 'ultra'],
        productName: 'Samsung Galaxy S23 Ultra',
        image: 'https://m.media-amazon.com/images/I/71OndSclunL._AC_SL1500_.jpg',
        offers: [
            {
                loja: 'Magalu',
                produto: 'Samsung Galaxy S23 Ultra 5G 512GB',
                preco_base: 5999.00,
                custo_frete: 0,
                prazo_dias: 1,
                reputacao: 'Alta',
                link: '#'
            },
            {
                loja: 'Samsung Official',
                produto: 'Samsung Galaxy S23 Ultra 5G 512GB',
                preco_base: 6299.00,
                custo_frete: 0,
                prazo_dias: 3,
                reputacao: 'Alta',
                link: '#'
            }
        ]
    },
    {
        terms: ['ps5', 'slim'],
        productName: 'PlayStation 5 Slim',
        image: 'https://m.media-amazon.com/images/I/510uTHyDqGL._AC_SL1000_.jpg',
        offers: [
            {
                loja: 'Kabum',
                produto: 'Console PlayStation 5 Slim',
                preco_base: 3499.90,
                custo_frete: 25.00,
                prazo_dias: 3,
                reputacao: 'Alta',
                link: '#'
            },
            {
                loja: 'Amazon',
                produto: 'Console PlayStation 5 Slim',
                preco_base: 3790.00,
                custo_frete: 0,
                prazo_dias: 2,
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
        const reputacaoScore = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };

        const sorted = processedOffers.sort((a, b) => {
            if (a.preco_total !== b.preco_total) {
                return a.preco_total - b.preco_total;
            }
            const repA = reputacaoScore[a.reputacao] || 0;
            const repB = reputacaoScore[b.reputacao] || 0;
            if (repA !== repB) {
                return repB - repA;
            }
            return a.prazo_dias - b.prazo_dias;
        });

        return {
            success: true,
            data: {
                productName: match.productName,
                image: match.image,
                offers: sorted
            }
        };
    }

    // Fallback for demo if no match found
    if (query.length > 3) {
        return {
            success: true,
            data: {
                productName: query,
                image: 'https://placehold.co/600x400/111/fff?text=' + encodeURIComponent(query),
                offers: [
                    {
                        loja: 'Varejo Demo',
                        produto: query,
                        preco_base: 199.90,
                        custo_frete: 15.00,
                        preco_total: 214.90,
                        prazo_dias: 5,
                        reputacao: 'Média',
                        link: '#'
                    }
                ]
            }
        }
    }

    return { success: false, error: 'Produto não encontrado.' };
}
