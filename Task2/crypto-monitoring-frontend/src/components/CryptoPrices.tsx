import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CryptoPricesProps {
    onSelectCrypto: (cryptoId: string) => void; // Define the prop type
}

const CryptoPrices: React.FC<CryptoPricesProps> = ({ onSelectCrypto }) => {
    const [prices, setPrices] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/prices');
                if (Array.isArray(response.data)) {
                    setPrices(response.data);
                } else {
                    setError('Unexpected response structure');
                }
            } catch (err) {
                setError('Error fetching prices');
            }
        };

        fetchPrices();
    }, []);

    return (
        <div>
            <h2>Latest Cryptocurrency Prices</h2>
            {error && <p>{error}</p>}
            <ul>
                {Array.isArray(prices) && prices.length > 0 ? (
                    prices.map((price, index) => (
                        <li key={index} onClick={() => onSelectCrypto(price.name)}>
                            {price.name}: ${price.value}
                        </li>
                    ))
                ) : (
                    <li>No prices available</li>
                )}
            </ul>
        </div>
    );
};

export default CryptoPrices;
