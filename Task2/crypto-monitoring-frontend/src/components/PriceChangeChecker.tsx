import React, { useState } from 'react';
import axios from 'axios';

const PriceChangeChecker: React.FC = () => {
    const [cryptoId, setCryptoId] = useState<string>('');
    const [previousPrice, setPreviousPrice] = useState<number | ''>('');
    const [currentPrice, setCurrentPrice] = useState<number | ''>('');
    const [threshold, setThreshold] = useState<number | ''>('');
    const [message, setMessage] = useState<string | null>(null);

    const handleCheckPriceChange = async () => {
        try {
            const response = await axios.post('/check-price-change', {
                cryptoId,
                previousPrice,
                currentPrice,
                threshold,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error checking price change');
        }
    };

    return (
        <div>
            <h2>Check Price Change</h2>
            <input
                type="text"
                placeholder="Crypto ID"
                value={cryptoId}
                onChange={(e) => setCryptoId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Previous Price"
                value={previousPrice}
                onChange={(e) => setPreviousPrice(Number(e.target.value))}
            />
            <input
                type="number"
                placeholder="Current Price"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
            />
            <input
                type="number"
                placeholder="Threshold"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <button onClick={handleCheckPriceChange}>Check Price Change</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PriceChangeChecker;
