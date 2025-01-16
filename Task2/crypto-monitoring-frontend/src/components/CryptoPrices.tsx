import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoPrices: React.FC = () => {
    const [prices, setPrices] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get('/prices');
                setPrices(response.data);
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
                {prices.map((price, index) => (
                    <li key={index}>{price.name}: ${price.value}</li>
                ))}
            </ul>
        </div>
    );
};

export default CryptoPrices;
