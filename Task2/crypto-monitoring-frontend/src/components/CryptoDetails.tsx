import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CryptoDetails.css'; // Import CSS for styling
import PriceAlertSettings from './PriceAlertSettings.tsx';

const CryptoDetails: React.FC<{ cryptoId: string }> = ({ cryptoId }) => {
    const [cryptoData, setCryptoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/prices/${cryptoId}`);
                setCryptoData(response.data);
            } catch (err) {
                setError("Error fetching cryptocurrency data");
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoData();
    }, [cryptoId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="crypto-details">
            <h2>{cryptoData.name}</h2>
            <p>Current Price: ${cryptoData.value}</p>
            {/* Add more details as needed */}
            <PriceAlertSettings /> {/* Add PriceAlertSettings component here */}
        </div>
    );
};

export default CryptoDetails;
