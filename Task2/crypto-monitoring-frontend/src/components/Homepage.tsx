import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Homepage.css'; // Import CSS for styling

const Homepage: React.FC = () => {
    const [cryptoPrices, setCryptoPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/prices');
                setCryptoPrices(response.data);
            } catch (err) {
                setError("Error fetching cryptocurrency prices");
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoPrices();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="homepage">
            <nav className="navbar">
                <h1>Crypto Monitor</h1>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/alerts">Alerts</Link></li>
                </ul>
            </nav>
            <header className="hero">
                <h2>Stay Updated with Cryptocurrency Prices</h2>
                <p>Monitor the latest prices and set alerts for your favorite cryptocurrencies.</p>
            </header>
            <section className="crypto-prices">
                <h3>Current Prices</h3>
                {cryptoPrices.map((crypto) => (
                    <Link to={`/prices/${crypto.name}`} className="price-card" key={crypto.name}>
                        <h4>{crypto.name}</h4>
                        <p>${crypto.value}</p>
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default Homepage;
