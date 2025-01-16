import React from 'react';
import CryptoPrices from './components/CryptoPrices.tsx';
import CachedPrices from './components/CachedPrices.tsx';
import PriceChangeChecker from './components/PriceChangeChecker.tsx';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Crypto Monitoring Dashboard</h1>
            <CryptoPrices />
            <CachedPrices />
            <PriceChangeChecker />
        </div>
    );
};

export default App;
