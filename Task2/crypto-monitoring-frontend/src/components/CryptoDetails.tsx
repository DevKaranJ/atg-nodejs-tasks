import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoDetails: React.FC<{ cryptoId: string }> = ({ cryptoId }) => {
    const [cryptoData, setCryptoData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/prices/${cryptoId}`);
                setCryptoData(response.data);
            } catch (err) {
                setError('Error fetching cryptocurrency data');
            }
        };

        if (cryptoId) {
            fetchCryptoData();
        }
    }, [cryptoId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!cryptoData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{cryptoId.toUpperCase()} Details</h2>
            <p>Current Price: ${cryptoData.value}</p>
            <p>Market Cap: ${cryptoData.market_cap}</p>
            <p>24h Volume: ${cryptoData.volume_24h}</p>
            <p>24h Change: {cryptoData.change_24h}%</p>
        </div>
    );
};

export default CryptoDetails;
