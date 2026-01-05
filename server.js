// server.js - Binance Alpha Monitor Backend
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory cache (替代node-cache)
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 30000; // 30 seconds

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Binance Alpha API
const BINANCE_ALPHA_API = 'https://www.binance.com/bapi/defi/v1/public/wallet-direct/buw/wallet/cex/alpha/all/token/list';

// Root endpoint - serve the HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get Alpha tokens (with CORS handling)
app.get('/api/alpha-tokens', async (req, res) => {
    try {
        // Check cache first
        if (cachedData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
            console.log('Returning cached Alpha tokens');
            return res.json(cachedData);
        }

        console.log('Fetching fresh Alpha tokens from Binance...');
        
        const response = await axios.get(BINANCE_ALPHA_API, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://www.binance.com/',
                'Origin': 'https://www.binance.com'
            },
            timeout: 10000
        });

        if (response.data && response.data.success) {
            // Transform data to standardize network names
            const transformedData = {
                ...response.data,
                data: response.data.data.map(token => ({
                    ...token,
                    network: mapNetwork(token.chainName || token.network || token.chain)
                }))
            };
            
            // Cache the result
            cachedData = transformedData;
            cacheTime = Date.now();
            console.log(`Successfully fetched ${transformedData.data?.length || 0} tokens`);
            res.json(transformedData);
        } else {
            throw new Error('Invalid response from Binance API');
        }

    } catch (error) {
        console.error('Error fetching Alpha tokens:', error.message);
        
        // Return fallback data if API fails
        const fallbackData = {
            success: true,
            data: [
                {
                    name: "AgentLISA",
                    symbol: "LISA",
                    contractAddress: "0x0AA9D742A1e3C4Ad2947eBbf268aFA15D7c9bFBd",
                    network: "BSC",
                    logo: ""
                },
                {
                    name: "AI16Z",
                    symbol: "AI16Z",
                    contractAddress: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
                    network: "SOLANA",
                    logo: ""
                },
                {
                    name: "Zerebro",
                    symbol: "ZEREBRO",
                    contractAddress: "HrrkVQ3RB8i...",
                    network: "SOLANA",
                    logo: ""
                },
                {
                    name: "Fartcoin",
                    symbol: "FARTCOIN",
                    contractAddress: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
                    network: "SOLANA",
                    logo: ""
                },
                {
                    name: "Moodeng",
                    symbol: "MOODENG",
                    contractAddress: "ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY",
                    network: "SOLANA",
                    logo: ""
                }
            ]
        };

        res.json({
            ...fallbackData,
            fallback: true,
            error: 'Using fallback data due to API error'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Helper function to map network names
function mapNetwork(network) {
    if (!network) return 'Unknown';
    
    const networkMap = {
        'SOL': 'Solana',
        'SOLANA': 'Solana',
        'BSC': 'BSC',
        'BNB': 'BSC',
        'BNB SMART CHAIN': 'BSC',
        'BINANCE SMART CHAIN': 'BSC',
        'ETH': 'Ethereum',
        'ETHEREUM': 'Ethereum',
        'POLYGON': 'Polygon',
        'MATIC': 'Polygon',
        'AVAX': 'Avalanche',
        'AVALANCHE': 'Avalanche',
        'ARB': 'Arbitrum',
        'ARBITRUM': 'Arbitrum'
    };

    const normalized = network.toUpperCase().trim();
    return networkMap[normalized] || network;
}

// Start server
const server = app.listen(PORT, () => {
    console.log('🚀 Binance Alpha Monitor Server Started');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/alpha-tokens`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
