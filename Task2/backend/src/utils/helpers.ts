import axios from "axios";

// Function to fetch current crypto prices from CoinGecko
export const getCryptoPricesFromAPI = async () => {
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
            params: {
                ids: "bitcoin,ethereum,ripple,litecoin,cardano,polkadot,chainlink,stellar,uniswap,bitcoin-cash",
                vs_currencies: "usd",
                include_market_cap: "true",
                include_24hr_vol: "true", 
                include_24hr_change: "true",
            },
        });

        return response.data;
    } catch (error) {
        throw new Error("Error fetching prices from CoinGecko");
    }
};
