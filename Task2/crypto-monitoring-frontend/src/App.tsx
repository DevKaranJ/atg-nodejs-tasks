import React, { useState } from 'react';
import Navbar from './components/Navbar.tsx';
import CryptoPrices from './components/CryptoPrices.tsx';
import CachedPrices from './components/CachedPrices.tsx';
import PriceAlertSettings from './components/PriceAlertSettings.tsx';
import CryptoDetails from './components/CryptoDetails.tsx';

const App: React.FC = () => {
    const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
    const [notificationCount] = useState<number>(0); // Placeholder for notification count

    return (
        <div>
            <Navbar notificationCount={notificationCount} />
            <h1>Crypto Monitoring Dashboard</h1>
            <CryptoPrices onSelectCrypto={setSelectedCrypto} />
            <CachedPrices />
            <PriceAlertSettings />
            {selectedCrypto && <CryptoDetails cryptoId={selectedCrypto} />}
        </div>
    );
};

export default App;
