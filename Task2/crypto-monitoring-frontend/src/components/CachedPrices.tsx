import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CachedPrices: React.FC = () => {
    const [cachedPrices, setCachedPrices] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCachedPrices = async () => {
            try {
                const response = await axios.get('/cached-prices');
                setCachedPrices(response.data);
            } catch (err) {
                setError('Error fetching cached prices');
            }
        };

        fetchCachedPrices();
    }, []);

    return (
        <div>
            <h2>Cached Cryptocurrency Prices</h2>
            {error && <p>{error}</p>}
            <ul>
                {cachedPrices.map((price, index) => (
                    <li key={index}>{price.name}: ${price.value}</li>
                ))}
            </ul>
        </div>
    );
};

export default CachedPrices;
