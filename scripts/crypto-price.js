const axios = require('axios');
const fs = require('fs');

async function getCryptoPrices() {
    try {
        // 使用CoinGecko免费API（无需API密钥）
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=cny&include_24hr_change=true');
        
        let result = "虚拟货币价格：\n";
        
        if (response.data.bitcoin) {
            const btc = response.data.bitcoin;
            result += `比特币(BTC): ${btc.cny}元 (24h: ${btc.cny_24h_change > 0 ? '+' : ''}${btc.cny_24h_change.toFixed(2)}%)\n`;
        }
        
        if (response.data.ethereum) {
            const eth = response.data.ethereum;
            result += `以太坊(ETH): ${eth.cny}元 (24h: ${eth.cny_24h_change > 0 ? '+' : ''}${eth.cny_24h_change.toFixed(2)}%)\n`;
        }
        
        return result;
    } catch (error) {
        console.error('获取虚拟货币价格失败:', error);
        return "虚拟货币价格：数据获取失败";
    }
}

async function main() {
    const cryptoPrices = await getCryptoPrices();
    fs.writeFileSync('crypto.txt', cryptoPrices, 'utf8');
    console.log('虚拟货币价格已保存');
}

main();
